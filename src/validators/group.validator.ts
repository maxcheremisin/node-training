import * as GroupSchema from 'schemas/group.schema';
import {createValidator} from './utils';

export const validateGroup = createValidator(GroupSchema.UpdateSchema);
