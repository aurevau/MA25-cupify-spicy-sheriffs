import middy from "@middy/core";
import { sendResponse } from "../../lib/response.mjs";
import { errorHandler } from "../../lib/errors.mjs";
import { getTournament } from "../../lib/tournaments.mjs";
import { getMatchesByTournamentId } from "../../lib/matches.mjs";

export const handler = middy(async (event) => {
  const tournamentId = event.pathParameters?.id;

  const tournament = await getTournament(tournamentId);
  if (!tournament) {
    return sendResponse(404, { message: "Turneringen kunde inte hittas" });
  }

  const matches = await getMatchesByTournamentId(tournamentId);

  return sendResponse(200, matches);
}).use(errorHandler());
