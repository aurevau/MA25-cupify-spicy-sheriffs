import middy from "@middy/core";
import { sendResponse } from "../../lib/response.mjs";
import { errorHandler, httpError } from "../../lib/errors.mjs";
import { getMatchById, deleteMatchById } from "../../lib/matches.mjs";

export const handler = middy(async (event) => {
  const tournamentId = event.pathParameters?.id;
  const matchId = event.pathParameters?.matchId;

  const existingMatch = await getMatchById(tournamentId, matchId);
  if (!existingMatch) {
    throw httpError(404, "Match not found");
  }

  await deleteMatchById(tournamentId, matchId);

  return sendResponse(200, {
    message: "Match deleted successfully",
    id: matchId,
    tournamentId: tournamentId,
  });
}).use(errorHandler());
