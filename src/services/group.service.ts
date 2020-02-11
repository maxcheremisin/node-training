import httpErrors from 'http-errors';
import {Group, GroupId} from 'types';
import {handleSequelizeError} from 'helpers';
import {model} from 'models';

export async function getGroupById(id: GroupId) {
    const group = await model.group
        .findOne({
            where: {
                group_id: id,
            },
        })
        .catch(handleSequelizeError());

    if (!group) {
        throw new httpErrors.NotFound(`No group with id ${id}`);
    }

    return group;
}

export function createGroup(payload: Omit<Group, 'group_id'>) {
    return model.group.create(payload).catch(handleSequelizeError({unique: `Group with name ${payload.name} already exists`}));
}

export function updateGroup(id: GroupId, payload: Partial<Group>) {
    return model.group
        .update(payload, {
            where: {
                group_id: id,
            },
        })
        .catch(handleSequelizeError({unique: `Group with name ${payload.name} already exists`}));
}

export function deleteGroup(id: GroupId) {
    return model.group
        .destroy({
            where: {
                group_id: id,
            },
        })
        .catch(handleSequelizeError());
}

export function getAll() {
    return model.group.findAll().catch(handleSequelizeError());
}
