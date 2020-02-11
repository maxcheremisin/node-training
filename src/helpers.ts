import express from 'express';
import httpErrors from 'http-errors';

export const parseError: express.ErrorRequestHandler = (error: httpErrors.HttpError, request, response, next) => {
    response.status(error.status).json(error);
    next();
};

export const handleSequelizeError = (message: {unique?: string} = {}) => (error: any) => {
    if ('errors' in error && Array.isArray(error.errors)) {
        for (const err of error.errors) {
            if (err.type === 'unique violation') {
                throw new httpErrors.Conflict(message.unique || err.message);
            }
        }
    }

    throw new httpErrors.InternalServerError(String(error));
};
