import { QueryCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
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
