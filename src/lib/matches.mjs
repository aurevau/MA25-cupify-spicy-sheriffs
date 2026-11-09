import { QueryCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { createError } from "@middy/util";
import { db } from "./db.mjs";

const TABLE_NAME = process.env.MATCHES_TABLE || "matches";

export const getMatchesByTournamentId = async (tournamentId) => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
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
    throw createError(500, "Could not fetch matches");
  }
};

export const getMatchById = async (tournamentId, matchId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      tournamentId: tournamentId,
      id: matchId,
    },
  });

  try {
    const { Item } = await db.send(command);
    return Item;
  } catch (error) {
    console.error("ERROR:", error);
    throw createError(500, "Could not fetch match");
  }
};

export const deleteMatchById = async (tournamentId, matchId) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      tournamentId: tournamentId,
      id: matchId,
    },
  });

  try {
    await db.send(command);
  } catch (error) {
    console.error("ERROR:", error);
    throw createError(500, "Could not delete match");
  }
};
