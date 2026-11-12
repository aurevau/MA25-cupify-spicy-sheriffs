import middy from "@middy/core";
import { parseBody, requireStrings, requireDate } from "../../lib/validate.mjs";


export const handler = middy(async (event) => {
    const tournamentId = event.pathParameters?.id;
    const matchId = event.pathParameters?.matchId;
    const body = parseBody(event);
    requireStrings(body, ["homeTeamId", "awayTeamId"]);
    requireDate(body.date, "date");

    if (body.homeTeamId === body.awayTeamId) {
        throw httpError(400, "A team cannot play against itself");
    }

    const tournament = await getTournament(tournamentId);
    if (!tournament) {
        throw httpError(404, "Tournament not found");
    }


    const match = await updateMatch(tournamentId, matchId, body);
    return sendResponse(200, match);
})