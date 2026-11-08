import { sendResponse } from "../../lib/response.mjs";
import { getTournaments } from "../../lib/tournaments.mjs"
import middy from '@middy/core';
import { errorHandler } from "../../lib/errors.mjs"; 

export const handler = middy(async (event) => {
    const tournaments = await getTournaments();
    return sendResponse(200, tournaments );
}).use(errorHandler());