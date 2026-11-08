import { createError } from "@middy/util";
import { sendResponse } from "../../lib/response.mjs";
import { getTournament } from "../../lib/tournaments.mjs"
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';

export const handler = middy(async (event) => {
    const { id } = event.pathParameters;
    const tournament = await getTournament(id);

    if (!tournament) throw createError(404, `Tournament ${id} not found`);
    return sendResponse(200, tournament);
}).use(httpErrorHandler());