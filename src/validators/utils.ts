import joi from 'joi';
import express from 'express';

export function createValidator(schema: joi.ObjectSchema): express.RequestHandler {
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
