import middy from "@middy/core";
import { sendResponse } from "../../lib/response.mjs";
import { errorHandler } from "../../lib/errors.mjs";
import { parseBody, requireScore } from "../../lib/validate.mjs";
import { reportResult } from "../../lib/matches.mjs";

export const handler = middy(async (event) => {
    const tournamentId = event.pathParameters?.id;
    const matchId = event.pathParameters?.matchId;
    const body = parseBody(event);
    requireScore(body.homeScore, "homeScore");
    requireScore(body.awayScore, "awayScore");

    const match = await reportResult(tournamentId, matchId, body);
    return sendResponse(200, match);
}).use(errorHandler());