import { httpError } from "./errors.mjs";

// Unvalid JSON or body that is not a JSON object gives 400
export const parseBody = (event) => {
    let body;
    try {
        body = JSON.parse(event.body ?? '');
    } catch {
        throw httpError(400, 'Request body must be valid JSON');
    }

    if (typeof body !== 'object' || body === null) {
        throw httpError(400, 'Request body must be a JSON object');
    }
    return body;
};

// Missing, non-string or blank fields give 400
export const requireStrings = (body, fields) => {
    for (const field of fields) {
        if (typeof body[field] !== 'string' || !body[field].trim()) {
            throw httpError(400, `${field} is required and can't be empty`);
        }
    }
};

// Valid date check
export const requireDate = (value, field) => {
    if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
        throw httpError(400, `${field} must be a valid date`);
    }
};

// Value must be one of the allowed values, for example for tournament status
export const requireOneOf = (value, allowed, field) => {
    if (!allowed.includes(value)) {
        throw httpError(400, `${field} must be one of: ${allowed.join(', ')}`);
    }
};

// Score must be an integer of 0 or more
export const requireScore = (value, field) => {
    if (!Number.isInteger(value) || value < 0) {
        throw httpError(400, `${field} must be an integer of 0 or more`);
    }
};