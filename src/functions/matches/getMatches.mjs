import middy from "@middy/core";
import { sendResponse } from "../../lib/response.mjs";
import { errorHandler, httpError } from "../../lib/errors.mjs";
import { getTournament } from "../../lib/tournaments.mjs";
import { getMatchesByTournamentId } from "../../lib/matches.mjs";

export const handler = middy(async (event) => {
  const tournamentId = event.pathParameters?.id;

  const tournament = await getTournament(tournamentId);
  if (!tournament) {
    throw httpError(404, "Tournament not found");
  }

  const matches = await getMatchesByTournamentId(tournamentId);

  return sendResponse(200, matches);
}).use(errorHandler());
