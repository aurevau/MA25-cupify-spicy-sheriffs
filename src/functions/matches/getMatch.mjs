import middy from "@middy/core";
import { sendResponse } from "../../lib/response.mjs";
import { errorHandler, httpError } from "../../lib/errors.mjs";
import { getMatchById } from "../../lib/matches.mjs";

export const handler = middy(async (event) => {
  const tournamentId = event.pathParameters?.id;
  const matchId = event.pathParameters?.matchId;

  const match = await getMatchById(tournamentId, matchId);

  if (!match) {
    throw httpError(404, "Match not found");
  }

  return sendResponse(200, match);
}).use(errorHandler());
