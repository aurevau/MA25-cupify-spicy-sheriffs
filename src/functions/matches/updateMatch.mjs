import middy from "@middy/core";
import { parseBody, requireStrings, requireDate } from "../../lib/validate.mjs";


export const handler = middy(async (event) => {
    const tournamentId = event.pathParameters?.id;
    const matchId = event.pathParameters?.matchId;
    const body = parseBody(event);
    requireStrings(body, ["homeTeamId", "awayTeamId"]);
    requireDate(body.date, "date");


    const match = await updateMatch(tournamentId, matchId, body);
    return sendResponse(200, match);
})