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

//Calculate stands from a tournament team and match
export const calculateStandings = (teams, matches) => {
    const table = new Map(teams.map((team) => [team.id, createRow(team)]));

    return [...table.values()];
};