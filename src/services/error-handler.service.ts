import httpErrors from 'http-errors';
import express from 'express';
import {Logger} from 'services/logger.service';

export class ServerError extends Error {
    constructor(public status: number, public message: string, public ext?: object) {
        super();
    }
}

export class ControllerError {
    constructor(public name: string, public method: string, public error: httpErrors.HttpError) {}
}

export class AuthError extends ServerError {
    private static messages = {
        401: 'Unauthorized',
        403: 'Forbidden',
    };

    constructor(public status: 401 | 403) {
        super(status, AuthError.messages[status]);
    }
}

export const handleError: express.ErrorRequestHandler = (error: httpErrors.HttpError, request, response, next) => {
    response.status(error.status || 500).json(error);
    next();
};

export const handleControllerError: express.ErrorRequestHandler = (error: httpErrors.HttpError | ControllerError, request, response, next) => {
    if (error instanceof ControllerError) {
        const message = error.error.message;
        const status = error.error.status;
        const controller = error.name;
        const method = error.method;

        Logger.warn(`${controller}.${method} [${request.originalUrl}]`);

        next(new ServerError(status, message, {controller, method, url: request.originalUrl}));
    } else {
        next(error);
    }
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
