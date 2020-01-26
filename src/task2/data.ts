import httpErrors from 'http-errors';
import {Sequelize, Model, DataTypes, Op} from 'sequelize';
import {User, UserId} from './types';
import {handleSequelizeError} from './schema';

const db = process.env.DB || '';
const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASSWORD;

const sequelize = new Sequelize(db, dbUser, dbPassword, {dialect: 'postgres'});

class UserModel extends Model implements User {
    public user_id!: UserId;
    public login!: string;
    public password!: string;
    public age!: number;
    public is_deleted!: boolean;
}

UserModel.init(
    {
        login: {
            type: DataTypes.STRING,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        password: {
            type: DataTypes.CHAR,
        },
        age: DataTypes.INTEGER,
        is_deleted: DataTypes.BOOLEAN,
    },
    {sequelize, tableName: 'users', timestamps: false},
);

export async function getUserById(id: UserId) {
    const user = await UserModel.findOne({
        where: {
            user_id: id,
            is_deleted: {
                [Op.or]: [null, false],
            },
        },
    }).catch(handleSequelizeError());

    if (!user) {
        throw new httpErrors.NotFound(`No user with id ${id}`);
    }

    return user;
}

export function createUser(payload: Omit<User, 'user_id'>) {
    return UserModel.create(payload).catch(handleSequelizeError({unique: `User with login ${payload.login} already exists`}));
}

export function updateUser(id: UserId, payload: Partial<User>) {
    return UserModel.update(payload, {
        where: {
            user_id: id,
            is_deleted: {
                [Op.or]: [null, false],
            },
        },
    }).catch(handleSequelizeError({unique: `User with login ${payload.login} already exists`}));
}

export function deleteUser(id: UserId) {
    return UserModel.update(
        {is_deleted: true},
        {
            where: {
                user_id: id,
                is_deleted: {
                    [Op.or]: [null, false],
                },
            },
        },
    ).catch(handleSequelizeError());
}

export function filterUsers(loginSubstring: string, limit: number) {
    return UserModel.findAll({
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
    }).catch(handleSequelizeError());
}
