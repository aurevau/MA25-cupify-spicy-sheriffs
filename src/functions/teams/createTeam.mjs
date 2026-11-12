import { sendResponse } from '../../lib/response.mjs';
import { createTeam } from '../../lib/teams.mjs';
import { getTournament } from '../../lib/tournaments.mjs';
import middy from '@middy/core';
import { httpError, errorHandler } from '../../lib/errors.mjs';
import { parseBody, requireStrings } from '../../lib/validate.mjs';



export const handler = middy(async (event) => {
    const { id } = event.pathParameters;
    const body = parseBody(event);
    requireStrings(body, ['name', 'city', 'coach']);

    const tournament = await getTournament(id);
    if (!tournament) throw httpError(404, `tournament ${id} not found`);

    const team = await createTeam(id, body);
    return sendResponse(201, team);
}).use(errorHandler());
