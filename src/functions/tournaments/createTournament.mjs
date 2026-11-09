import { sendResponse } from '../../lib/response.mjs';
import { createTournament } from '../../lib/tournaments.mjs';
import middy from '@middy/core';
import { errorHandler } from '../../lib/errors.mjs';
import { parseBody, requireStrings, requireDate } from '../../lib/validate.mjs';

export const handler = middy(async (event) => {
    const body = parseBody(event);
    requireStrings(body, ['name', 'sport', 'location']);
    requireDate(body.startDate, 'startDate');
    
    const tournament = await createTournament(body);
    return sendResponse(201, tournament);
}).use(errorHandler());