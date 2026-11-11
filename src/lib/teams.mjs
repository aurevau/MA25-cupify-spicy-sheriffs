import {PutCommand, GetCommand, QueryCommand} from '@aws-sdk/lib-dynamodb';
import {randomUUID} from 'node:crypto';
import {createError}from '@middy/util';
import {db} from './db.mjs';

export const createTeam = async (tournamentId, {name, city, coach}) => {
    const team = {
        id: randomUUID(),
        tournamentId,
        name,
        city,
        coach
    };

    const command = new PutCommand({
        TableName: 'teams',
        Item: team});

        try {
            await db.send(command);
            return team;
         }           catch (error) {
            console.error('ERROR:', error);
            throw createError(500, 'Failed to create team');
        }
    };