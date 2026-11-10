import { sendResponse } from '../../lib/response.mjs';
import { updateTournamentStatus } from '../../lib/tournaments.mjs';
import middy from '@middy/core';
import { httpError, errorHandler } from '../../lib/errors.mjs';
import { parseBody, requireOneOf } from '../../lib/validate.mjs';

const ALLOWED_STATUSES = ['upcoming', 'ongoing', 'completed'];

export const handler = middy(async (event) => {
    const { id } = event.pathParameters;
    const body = parseBody(event);
    requireOneOf(body.status, ALLOWED_STATUSES, 'status');

    const tournament = await updateTournamentStatus(id, body.status);

    if (!tournament) throw httpError(404, `Tournament ${id} not found`);
    return sendResponse(200, tournament);
}).use(errorHandler());