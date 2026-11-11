import middy from "@middy/core";
import { sendResponse } from "../../lib/response.mjs"
import { errorHandler, httpError } from "../../lib/errors.mjs";
import { parseBody, requireStrings, requireDate} from "../../lib/validate.mjs"

export const handler = middy(async (event) => {
    const body = parseBody(event);
    requireStrings(body, ["hometeamid", "awayteamid"]);
    requireDate(body.date, "date");

    const match = await crateMatch(tournamentid, body);
    return sendResponse(201, match);
}).use(errorHandler)