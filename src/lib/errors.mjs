import { createError } from '@middy/util';
import httpErrorHandler from '@middy/http-error-handler';

export const httpError = (status, message) => createError(status, JSON.stringify({ error: message }));

export const errorHandler = () =>
    httpErrorHandler({
        fallbackMessage: JSON.stringify({ error: 'Internal server error' }),
    });