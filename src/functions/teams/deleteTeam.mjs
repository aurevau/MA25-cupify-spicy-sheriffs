import middy from "@middy/core";
import { errorHandler, httpError } from "../../lib/errors.mjs";
import { getTeamById, deleteTeamById } from "../../lib/teams.mjs";
import { getMatchesByTournamentId } from "../../lib/matches.mjs";

export const handler = middy(async (event) => {
  const tournamentId = event.pathParameters?.id;
  const teamId = event.pathParameters?.teamId;

  const existingTeam = await getTeamById(tournamentId, teamId);
  if (!existingTeam) {
    throw httpError(404, "Team not found");
  }

  const matches = await getMatchesByTournamentId(tournamentId);
  const isTeamInMatch = matches.some(
    (match) => match.homeTeamId === teamId || match.awayTeamId === teamId,
  );

  if (isTeamInMatch) {
    throw httpError(409, "Cannot delete team associated with existing matches");
  }

  await deleteTeamById(tournamentId, teamId);

  return { statusCode: 204 };
}).use(errorHandler());
