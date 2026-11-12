import {
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { createError } from "@middy/util";
import { db } from "./db.mjs";

// Saves a new team. The backend creates the id, and tournamentId comes from the URL.
export const createTeam = async (tournamentId, { name, city, coach }) => {
  const team = {
    id: randomUUID(),
    tournamentId,
    name,
    city,
    coach,
  };

  const command = new PutCommand({
    TableName: "teams",
    Item: team,
  });

  try {
    await db.send(command);
    return team;
  } catch (error) {
    console.error("ERROR:", error);
    throw createError(500, "Failed to create team");
  }
};

// Reads one team. Returns undefined if it doesn't exist, which the handler turns into a 404.
export const getTeam = async (tournamentId, teamId) => {
  const command = new GetCommand({
    TableName: "teams",
    Key: {
      tournamentId,
      id: teamId,
    },
  });
  try {
    const { Item } = await db.send(command);
    return Item;
  } catch (error) {
    console.error("ERROR:", error);
    throw createError(500, "Could not fetch team");
  }
};
// Reads all teams in one tournament. Returns [] if there are none.
export const getTeamsByTournament = async (tournamentId) => {
  const command = new QueryCommand({
    TableName: "teams",
    KeyConditionExpression: "tournamentId = :tournamentId",
    ExpressionAttributeValues: {
      ":tournamentId": tournamentId,
    },
  });
  try {
    const { Items } = await db.send(command);
    return Items ?? [];
  } catch (error) {
    console.error("ERROR:", error);
    throw createError(500, "Could not fetch teams");
  }
};

// Replaces a team's info. Returns undefined if the team doesn't exist, which the handler turns into a 404.
export const updateTeam = async (
  tournamentId,
  teamId,
  { name, city, coach },
) => {
  const team = {
    id: teamId,
    tournamentId,
    name,
    city,
    coach,
  };

  const command = new PutCommand({
    TableName: "teams",
    Item: team,
    ConditionExpression: "attribute_exists(id)", // Only update if the team exists
  });
  try {
    await db.send(command);
    return team;
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return undefined;
    }
    console.error("ERROR:", error);
    throw createError(500, "Could not update team");
  }
};

// Deletes one team from a tournament.
export const deleteTeam = async (tournamentId, teamId) => {
  const command = new DeleteCommand({
    TableName: "teams",
    Key: {
      tournamentId,
      id: teamId,
    },
  });
  try {
    await db.send(command);
  } catch (error) {
    console.error("ERROR:", error);
    throw createError(500, "Could not delete team");
  }
};