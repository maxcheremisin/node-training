import httpErrors from 'http-errors';
import uuid from 'uuid/v5';
import {User, UserId} from './types';

export const users = new Map<UserId, User>();

export function generateId(login: string) {
    return uuid(login, uuid.URL) as UserId;
}

export function validateLogin<T extends Partial<User>>(payload: T) {
    const {login} = payload;

    const found = getAllUsers().find(user => user.login === login);

    if (found) {
        throw new httpErrors.BadRequest(`User with login ${login} already exists`);
    }

    return payload;
}

export function appendUser(id: UserId, user: User) {
    users.set(id, user);
    return user;
}

export function getAllUsers() {
    return Array.from(users.values());
}

export function getUserById(id: UserId) {
    const user = users.get(id);

    if (!user || user.isDeleted) {
        throw new httpErrors.NotFound(`No user with id ${id}`);
    }

    return user;
}

export function createUser(payload: Omit<User, 'id'>) {
    const user = validateLogin(payload);
    const id = generateId(user.login);

    return appendUser(id, {...user, id});
}

export function updateUser(id: UserId, payload: Partial<User>) {
    const prevUser = getUserById(id);
    const isLoginChanged = prevUser.login !== payload.login;
    const nextUser = isLoginChanged ? validateLogin(payload) : payload;

    return appendUser(id, {...prevUser, ...nextUser, id});
}

export function deleteUser(id: UserId) {
    const user = getUserById(id);

    return appendUser(id, {...user, isDeleted: true});
}

export function filterUsers(loginSubstring: string, limit: number) {
    const result: User[] = [];

    const allUsers = getAllUsers().sort((a, b) => a.login.localeCompare(b.login));

    for (const user of allUsers) {
        if (result.length == limit) {
            break;
        }

        if (user.login.includes(loginSubstring)) {
            result.push(user);
        }
    }

    return result;
}
