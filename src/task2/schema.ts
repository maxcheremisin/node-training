import express from 'express';
import httpErrors from 'http-errors';
import joi from 'joi';
import PasswordComplexity from 'joi-password-complexity';
import {User} from './types';

type UserKeys = keyof Omit<User, 'id'>;
type UserRules = Record<UserKeys, joi.StringSchema | joi.BooleanSchema | joi.NumberSchema>;

function getRequiredUserKeys<T extends UserKeys>(keys: T extends UserKeys ? UserKeys[] : never) {
    return keys;
}

const rules: UserRules = {
    login: joi.string(),
    password: new PasswordComplexity({
        min: 6,
        max: 26,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
    }) as joi.StringSchema,
    age: joi
        .number()
        .strict()
        .min(4)
        .max(130),
    isDeleted: joi.boolean(),
};

export const userPutSchema = joi.object().keys(rules);
export const userPostSchema = userPutSchema.requiredKeys(getRequiredUserKeys(['login', 'password', 'age']));

export function validateUserSchema(schema: joi.ObjectSchema): express.RequestHandler {
    return (req, res, next) => {
        const {error} = schema.validate(req.body);

        if (error == null) {
            return next();
        }

        if (error.isJoi) {
            res.status(400).json({errors: error.details});
        } else {
            next(error);
        }
    };
}

export const parseError: express.ErrorRequestHandler = (error: httpErrors.HttpError, request, response, next) => {
    response.status(error.status).json(error);
    next();
};
