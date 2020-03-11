import jwt from 'jsonwebtoken';
import {Op} from 'sequelize';
import {model} from 'models';
import {env} from 'config/env';
import * as types from 'types';
import {handleSequelizeError, ServerError} from 'services/error-handler.service';

export async function getToken({login, password}: types.AuthParams) {
    const user: types.User = await model.user
        .findOne({
            where: {
                login,
                is_deleted: {
                    [Op.or]: [null, false],
                },
            },
        })
        .catch(handleSequelizeError());

    if (!user || user.password !== password) {
        throw new ServerError(403, 'Incorrect login or password');
    }

    return generateToken(user);
}

export function verifyToken(token: string, cb: jwt.VerifyCallback) {
    return jwt.verify(token, env.jwtSecret, cb);
}

function generateToken(user: types.User) {
    return jwt.sign(
        {
            id: user.user_id,
            login: user.login,
        },
        env.jwtSecret,
        {expiresIn: '1d'},
    );
}
