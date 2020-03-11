import joi from 'joi';
import {AuthParams} from 'types';

type AuthParamsKeys = keyof AuthParams;

type AuthParamsRules = Record<AuthParamsKeys, joi.StringSchema>;

function validateKeys<T extends AuthParamsKeys>(keys: T extends AuthParamsKeys ? AuthParamsKeys[] : never) {
    return keys;
}

const AuthParamsSchema: AuthParamsRules = {
    login: joi.string(),
    password: joi.string(),
};

export const LoginSchema = joi
    .object()
    .keys(AuthParamsSchema)
    .requiredKeys(validateKeys(['login', 'password']));
