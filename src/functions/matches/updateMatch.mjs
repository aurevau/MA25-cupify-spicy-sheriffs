import middy from "@middy/core";
import { sendResponse } from "../../lib/response.mjs";
import { errorHandler, httpError } from "../../lib/errors.mjs";
import { parseBody, requireStrings, requireDate } from "../../lib/validate.mjs";
import { updateMatch } from "../../lib/matches.mjs";
import { getTournament } from "../../lib/tournaments.mjs";
import { getTeam } from "../../lib/teams.mjs";

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

        const teams = await Promise.all([
            getTeam(tournamentId, body.homeTeamId),
            getTeam(tournamentId, body.awayTeamId),
        ]);
        if (teams.some((team) => !team)) {
            throw httpError(404, "Team not found in tournament");
        }


        const match = await updateMatch(tournamentId, matchId, body);
        return sendResponse(200, match);
}).use(errorHandler());