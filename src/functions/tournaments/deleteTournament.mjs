import { getTournament, hasTeamsOrMatches, deleteTournament } from '../../lib/tournaments.mjs';
import middy from '@middy/core';
import { httpError, errorHandler } from '../../lib/errors.mjs';

export const handler = middy(async (event) => {
    const { id } = event.pathParameters;

    const tournament = await getTournament(id);
    if (!tournament) throw httpError(404, `Tournament ${id} not found`);

    if (await hasTeamsOrMatches(id)) {
        throw httpError(409, 'Tournament cannot be deleted because it has teams or matches');
    }

    await deleteTournament(id);
    return { statusCode: 204 };
}).use(errorHandler());