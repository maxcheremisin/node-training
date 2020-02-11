import * as UserSchema from 'schemas/user.schema';
import {createValidator} from './utils';

export const createUser = createValidator(UserSchema.CreateSchema);
export const updateUser = createValidator(UserSchema.UpdateSchema);
