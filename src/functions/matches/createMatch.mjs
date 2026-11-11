import middy from "@middy/core";
import { sendResponse } from "../../lib/response.mjs"
import { errorHandler, httpError } from "../../lib/errors.mjs";
import { parseBody, requireStrings, requireDate} from "../../lib/validate.mjs"

export const handler = middy(async (event) => {
    const tournamentId = event.pathParameters?.id;
    const body = parseBody(event);
    requireStrings(body, ["homeTeamId", "awayTeamId"]);
    requireDate(body.date, "date");

    const match = await crateMatch(tournamentId, body);
    return sendResponse(201, match);
}).use(errorHandler())