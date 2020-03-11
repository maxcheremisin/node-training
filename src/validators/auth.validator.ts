import * as AuthSchema from 'schemas/auth.schema';
import {createValidator} from './utils';

export const validateAuthParams = createValidator(AuthSchema.LoginSchema);
