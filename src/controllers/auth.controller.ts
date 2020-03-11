import express from 'express';
import * as types from 'types';
import * as AuthValidator from 'validators/auth.validator';
import * as AuthService from 'services/auth.service';
import {ControllerError} from 'services/error-handler.service';

export class AuthController implements types.Controller {
    public static loginUrl = '/api/auth/login';

    public readonly router = express.Router();

    constructor() {
        const authRouter = express.Router();

        authRouter.post('/login', AuthValidator.validateAuthParams, async (req, res, next) => {
            try {
                const authParams = req.body as types.AuthParams;
                const token = await AuthService.getToken(authParams);

                res.status(200).json({token});
            } catch (error) {
                next(new ControllerError('Auth', 'getToken', error));
            }
        });

        this.router.use('/auth', authRouter);
    }
}
