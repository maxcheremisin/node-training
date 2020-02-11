import joi from 'joi';
import {Group, AllPermissions} from 'types';

type GroupKeys = keyof Omit<Group, 'group_id'>;
type GroupRules = Record<GroupKeys, joi.StringSchema | joi.ArraySchema>;

const GroupSchema: GroupRules = {
    name: joi.string(),
    permissions: joi
        .array()
        .allow(...AllPermissions)
        .unique(),
};

export const UpdateSchema = joi.object().keys(GroupSchema);
