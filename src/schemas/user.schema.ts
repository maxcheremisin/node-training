import joi from 'joi';
import PasswordComplexity from 'joi-password-complexity';
import {User} from 'types';

type UserKeys = keyof Omit<User, 'user_id'>;
type UserRules = Record<UserKeys, joi.StringSchema | joi.BooleanSchema | joi.NumberSchema>;

function validateKeys<T extends UserKeys>(keys: T extends UserKeys ? UserKeys[] : never) {
    return keys;
}

const UserSchema: UserRules = {
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
    is_deleted: joi.boolean(),
};

export const UpdateSchema = joi.object().keys(UserSchema);
export const CreateSchema = UpdateSchema.requiredKeys(validateKeys(['login', 'password', 'age']));
