import { QueryCommand, GetCommand, DeleteCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { createError } from "@middy/util";
import { db } from "./db.mjs";
import { randomUUID } from "node:crypto";
import { httpError } from "./errors.mjs";

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

// Radera en match
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

export const updateMatch = async (tournamentId, matchId, { homeTeamId, awayTeamId, date }) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { tournamentId, id: matchId },
    UpdateExpression: "SET homeTeamId = :homeTeamId, awayTeamId = :awayTeamId, #date = :date",
    ConditionExpression: "attribute_exists(id) AND #status = :scheduled",
    ExpressionAttributeNames: {"#date": "date", "#status": "status" },
    ExpressionAttributeValues:{
      ":homeTeamId": homeTeamId,
      ":awayTeamId": awayTeamId,
      ":date": date,
      ":scheduled": "scheduled",
    },
    ReturnValues: "ALL_NEW",
    ReturnValuesOnConditionCheckFailure: "ALL_OLD",
  });
  
  try {
    const { Attributes } = await db.send(command);
    return Attributes;
  } catch (error){
    if (error.name ==="ConditionalCheckFailedException"){
      if (!error.Item) throw httpError(404, "Match not found");
      throw httpError(409, "Only scheduled matches can be updated")
    }
    console.error("ERROR:", error);
    throw createError(500, "Could not update match");
  }
};

export const reportResult = async (tournamentId, matchId, { homeScore, awayScore }) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { tournamentId, id: matchId },
    UpdateExpression: "SET homeScore = :homeScore, awayScore = :awayScore, #status = :completed",
    ConditionExpression: "attribute_exists(id) AND #status = :scheduled",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues:{
      ":homeScore": homeScore,
      ":awayScore": awayScore,
      ":completed": "completed",
      ":scheduled": "scheduled",
    },
    ReturnValues: "ALL_NEW",
    ReturnValuesOnConditionCheckFailure: "ALL_OLD",
  });
  try {
    const { Attributes } = await db.send(command);
    return Attributes;
  } catch (error){
    if (error.name ==="ConditionalCheckFailedException"){
      if (!error.Item) throw httpError(404, "Match not found");
      throw httpError(409, "Only scheduled matches can have results registered")
    }
    console.error("ERROR:", error);
    throw createError(500, "Could not report match results");
  }
};

export const createMatch = async (tournamentId, { homeTeamId, awayTeamId, date }) => {
  let teams;
  try {
    teams = await Promise.all(
      [homeTeamId, awayTeamId].map((id) =>
        db.send(new GetCommand({
          TableName: process.env.TEAMS_TABLE || "teams",
          Key: { tournamentId, id },
        }))
      )
    );
  } catch (error) {
    console.error("ERROR:", error);
    throw createError(500, "Could not verify teams");
  }

  if (teams.some(({ Item }) => !Item)) {
    throw httpError(404, "Team not found in tournament");
  }

  const match = {
    id: randomUUID(),
    tournamentId,
    homeTeamId,
    awayTeamId,
    date,
    status: "scheduled",
    homeScore: null,
    awayScore: null,
  };
  try {
    await db.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: match,
    }));
    return match;
  } catch (error) {
    console.error("ERROR", error);
    throw createError(500, "Could not create match");
  }
};
