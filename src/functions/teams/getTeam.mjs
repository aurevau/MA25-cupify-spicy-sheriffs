import { sendResponse } from '../../lib/response.mjs';
import { getTeam } from '../../lib/teams.mjs';
import middy from '@middy/core';
import { httpError, errorHandler } from '../../lib/errors.mjs';

export const handler = middy(async (event) => {
    const { id, teamId } = event.pathParameters;

    const team = await getTeam(id, teamId);
    if (!team) throw httpError(404, `team ${teamId} not found`);

    ß
    return sendResponse(200, team);
}).use(errorHandler());
