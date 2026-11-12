import { sendResponse } from '../../lib/response.mjs';
import { getTournament } from '../../lib/tournaments.mjs';
import { getTeamsByTournament } from '../../lib/teams.mjs';
import { getMatchesByTournamentId } from '../../lib/matches.mjs';
import { calculateStandings } from '../../lib/standings.mjs';
import middy from '@middy/core';
import { httpError, errorHandler } from '../../lib/errors.mjs';

export const handler = middy(async (event) => {
    const { id } = event.pathParameters;

    const tournament = await getTournament(id);
    if (!tournament) throw httpError(404, `Tournament ${id} not found`);

    const [teams, matches] = await Promise.all([
        getTeamsByTournament(id),
        getMatchesByTournamentId(id)
    ]);

    const standings = calculateStandings(teams, matches);
    return sendResponse(200, standings);
}).use(errorHandler());