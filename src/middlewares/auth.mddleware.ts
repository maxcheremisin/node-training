import express from 'express';
import {AuthController} from 'controllers/auth.controller';
import {AuthError} from 'services/error-handler.service';
import {verifyToken} from 'services/auth.service';

export function auth(): express.RequestHandler {
    return (req, res, next) => {
        if (req.url === AuthController.loginUrl) {
            return next();
        }

        const tokenHeader = req.headers['x-access-token'];
        const token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;

        if (!token) {
            return next(new AuthError(401));
        }

        verifyToken(token, error => {
            if (error) {
                return next(new AuthError(403));
            }

            return next();
        });
    };
}
