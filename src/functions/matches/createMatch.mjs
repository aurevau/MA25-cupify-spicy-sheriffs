import middy from "@middy/core";
import { sendResponse } from "../../lib/response.mjs"
import { errorHandler, httpError } from "../../lib/errors.mjs";
import { parseBody, requireStrings, requireDate} from "../../lib/validate.mjs"
import { createMatch } from "../../lib/matches.mjs"
import { getTournament } from "../../lib/tournaments.mjs";

export const handler = middy(async (event) => {
    const tournamentId = event.pathParameters?.id;
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

    const match = await createMatch(tournamentId, body);
    return sendResponse(201, match);
}).use(errorHandler())