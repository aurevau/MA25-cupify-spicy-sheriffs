import { QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { createError } from '@middy/util';
import { db } from './db.mjs';

export const getTournaments = async () => {

    const command = new QueryCommand({
        TableName: 'tournaments',
        KeyConditionExpression: 'entity = :entity',
        ExpressionAttributeValues: {
            ':entity': 'tournament'
        }
    });
    try {
        const { Items } = await db.send(command);
        return (Items ?? []).map(({ entity, ...tournament }) => tournament);
    } catch (error) {
        console.error('ERROR:', error);
        throw createError(500, 'Could not fetch tournaments');

    }
}

export const getTournament = async (id) => {
    const command = new GetCommand({
        TableName: 'tournaments',
        Key: {
            entity: 'tournament',
            id: id
        }
    });

    try {
        const { Item } = await db.send(command);
        if (!Item) return undefined;
        const { entity, ...tournament } = Item;
        return tournament;
    } catch (error) {
        console.error('ERROR:', error);
        throw createError(500, 'Could not fetch tournament');
    }
}

export const createTournament = async ({ name, sport, location, startDate }) => {
    const tournament = {
        id: randomUUID(),
        name,
        sport,
        location,
        startDate,
        status: 'upcoming'
    };

    const command = new PutCommand({
        TableName: 'tournaments',
        Item: {
            entity: 'tournament',
            ...tournament
        }
    });

    try {
        await db.send(command);
        return tournament;
    } catch (error) {
        console.error('ERROR:', error);
        throw createError(500, 'Could not create tournament');
    }
}

export const updateTournamentStatus = async (id, status) => {
    const command = new UpdateCommand({
        TableName: 'tournaments',
        Key: {
            entity: 'tournament',
            id: id
        },
        UpdateExpression: 'SET #status = :status',
        ConditionExpression: 'attribute_exists(id)',
        ExpressionAttributeNames: {
            '#status': 'status'
        },
        ExpressionAttributeValues: {
            ':status': status
        },
        ReturnValues: 'ALL_NEW'
    });

    try {
        const { Attributes } = await db.send(command);
        const { entity, ...tournament } = Attributes;
        return tournament;
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            return undefined;
        }
        console.error('ERROR:', error);
        throw createError(500, 'Could not update tournament status');
    }
}

export const hasTeamsOrMatches = async (tournamentId) => {
    const query = (tableName) => new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'tournamentId = :tournamentId',
        ExpressionAttributeValues: {
            ':tournamentId': tournamentId
        },
        Limit: 1
    });

    try {
        const [teams, matches] = await Promise.all([
            db.send(query('teams')),
            db.send(query('matches'))
        ]);
        return teams.Items.length > 0 || matches.Items.length > 0;
    } catch (error) {
        console.error('ERROR:', error);
        throw createError(500, 'Could not check teams and matches');
    }
}

export const deleteTournament = async (id) => {
    const command = new DeleteCommand({
        TableName: 'tournaments',
        Key: {
            entity: 'tournament',
            id: id
        }
    });

    try {
        await db.send(command);
    } catch (error) {
        console.error('ERROR:', error);
        throw createError(500, 'Could not delete tournament');
    }
}
