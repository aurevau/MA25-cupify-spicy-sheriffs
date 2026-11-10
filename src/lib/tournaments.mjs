import { QueryCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { createError } from '@middy/util';
import { db } from './db.mjs';

export const getTournaments = async () => {

    const command = new QueryCommand({
        TableName: 'tournaments',
        KeyConditionExpression: 'entity = :entity',
        ExpressionAttributeValues: {
            ':entity' : 'tournament'
        }});
    try {
        const { Items } = await db.send(command);
        return Items ?? [];
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
        return Item;
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
