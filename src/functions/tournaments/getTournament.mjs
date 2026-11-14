import { sendResponse } from "../../lib/response.mjs";
import { getTournament } from "../../lib/tournaments.mjs"
import middy from '@middy/core';
import { httpError, errorHandler } from "../../lib/errors.mjs";

export const handler = middy(async (event) => {
    const { id } = event.pathParameters;
    const tournament = await getTournament(id);

    if (!tournament) throw httpError(404, `Tournament ${id} not found`);
    return sendResponse(200, tournament);
}).use(errorHandler());