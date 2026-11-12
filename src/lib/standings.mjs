//Create empty table row for team
const createRow = (team) => ({
    teamId: team.id,
    teamName: team.name,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0
});

//Add one match result to a teams row, seen from that team's side
const addResult = (row,scored,conceded) => {
    row.played += 1;
    row.goalsFor += scored;
    row.goalsAgainst += conceded;
    row.goalDifference = row.goalsFor - row.goalsAgainst;

    if (scored > conceded) {
        row.wins += 1;
        row.points += 3;
    } else if (scored === conceded) {
        row.draws += 1;
        row.points += 1;
    } else {
        row.losses += 1;
    }
};

//Calculate stands from a tournament team and match
export const calculateStandings = (teams, matches) => {
    const table = new Map(teams.map((team) => [team.id, createRow(team)]));

    const completedMatches = matches.filter((match) => match.status === 'completed');

    for (const match of completedMatches) {
        const home = table.get(match.homeTeamId);
        const away = table.get(match.awayTeamId);
        if (!home || !away) continue;

        addResult(home, match.homeScore, match.awayScore);
        addResult(away, match.awayScore, match.homeScore);
    }

    return [...table.values()];
};