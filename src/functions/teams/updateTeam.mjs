import { sendResponse } from "../../lib/response.mjs";
import { updateTeam } from "../../lib/teams.mjs";
import middy from "@middy/core";
import { httpError, errorHandler } from "../../lib/errors.mjs";
import { parseBody, requireStrings } from "../../lib/validate.mjs";

export const handler = middy(async (event) => {
    const { id, teamId } = event.pathParameters;
    const body = parseBody(event);
    requireStrings(body, ['name', 'city', 'coach']);

    const team = await updateTeam(id, teamId, body);
    if (!team) throw httpError(404, `Team ${teamId} not found`);

    return sendResponse(200, team);
}).use(errorHandler());