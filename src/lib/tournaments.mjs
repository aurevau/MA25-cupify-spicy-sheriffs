import { QueryCommand } from '@aws-sdk/lib-dynamodb';
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
