import { sendResponse } from '../../lib/response.mjs';
import { getTeamsByTournament } from '../../lib/teams.mjs';
import { getTournament } from '../../lib/tournaments.mjs';
import middy from '@middy/core';
import { httpError, errorHandler } from '../../lib/errors.mjs';


export const handler = middy(async (event) => {
    const { id } = event.pathParameters;

    const tournament = await getTournament(id);
    if (!tournament) throw httpError(404, `tournament ${id} not found`);


    const teams = await getTeamsByTournament(id);
    return sendResponse(200, teams);
}).use(errorHandler());