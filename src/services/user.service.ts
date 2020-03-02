import httpErrors from 'http-errors';
import {Op} from 'sequelize';
import {User, UserId} from 'types';
import {handleSequelizeError} from 'services/error-handler.service';
import {model} from 'models';

export async function getUserById(id: UserId) {
    const user = await model.user
        .findOne({
            where: {
                user_id: id,
                is_deleted: {
                    [Op.or]: [null, false],
                },
            },
        })
        .catch(handleSequelizeError());

    if (!user) {
        throw new httpErrors.NotFound(`No user with id ${id}`);
    }

    return user;
}

export function createUser(payload: Omit<User, 'user_id'>) {
    return model.user.create(payload).catch(handleSequelizeError({unique: `User with login ${payload.login} already exists`}));
}

export function updateUser(id: UserId, payload: Partial<User>) {
    return model.user
        .update(payload, {
            where: {
                user_id: id,
                is_deleted: {
                    [Op.or]: [null, false],
                },
            },
        })
        .catch(handleSequelizeError({unique: `User with login ${payload.login} already exists`}));
}

export function deleteUser(id: UserId) {
    return model.user
        .update(
            {is_deleted: true},
            {
                where: {
                    user_id: id,
                    is_deleted: {
                        [Op.or]: [null, false],
                    },
                },
            },
        )
        .catch(handleSequelizeError());
}

export function filterUsers(loginSubstring: string, limit: number) {
    return model.user
        .findAll({
            limit,
            order: [['login', 'ASC']],
            where: {
                login: {
                    [Op.like]: `%${loginSubstring}%`,
                },
                is_deleted: {
                    [Op.or]: [null, false],
                },
            },
        })
        .catch(handleSequelizeError());
}
