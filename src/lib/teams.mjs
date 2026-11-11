import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { createError } from '@middy/util';
import { db } from './db.mjs';

export const createTeam = async (tournamentId, { name, city, coach }) => {
    const team = {
        id: randomUUID(),
        tournamentId,
        name,
        city,
        coach
    };

    const command = new PutCommand({
        TableName: 'teams',
        Item: team
    });

    try {
        await db.send(command);
        return team;
    } catch (error) {
        console.error('ERROR:', error);
        throw createError(500, 'Failed to create team');
    }
};

export const getTeam = async (tournamentId, teamId) => {
    const command = new GetCommand({
        TableName: 'teams',
        Key: {
            tournamentId,
            id: teamId
        }
    });
    try {
        const { Item } = await db.send(command);
        return Item;
    } catch (error) {
        console.error('ERROR:', error);
        throw createError(500, 'Could not fetch team');
    }
};

export const getTeamsByTournament  = async (tournamentId) => {
    const command = new QueryCommand({
        TableName: 'teams',
        keyConditionExpression: 'tournamentId = :tournamentId',
        ExpressionAttributeValues: {
            ':tournamentId': tournamentId
        }
    });
    try {
        const {Items} = await db.send(command);
        return Items ?? [];
    } catch (error) {
        console.error('ERROR:', error);
        throw createError(500, 'Could not fetch teams');
    }
};