import request from 'supertest';
import express from 'express';
import * as types from 'types';
import * as UserService from 'services/user.service';
import {UserController} from './user.controller';

const controller = new UserController();
const app = express();

app.use(express.json());
app.use(controller.router);

jest.mock('../models', () => {
    const SequelizeMock = require('sequelize-mock'); // eslint-disable-line
    const dbMock = new SequelizeMock();
    const userDefaultAttributes: types.User = {
        user_id: 1 as types.UserId,
        login: 'user_1',
        password: 'Password_123',
        age: 14,
        is_deleted: false,
    };

    const userMock = dbMock.define('users', userDefaultAttributes, {tableName: 'users', timestamps: false});

    return {
        model: {
            user: userMock,
        },
    };
});

const updateUserSpy = jest.spyOn(UserService, 'updateUser');
const filterUsersSpy = jest.spyOn(UserService, 'filterUsers');
const deleteUsersSpy = jest.spyOn(UserService, 'deleteUser');

describe('should test user controller', () => {
    test('should test user suggestion filter', async () => {
        const res = await request(app).get('/user/filter?login=user&limit=10');

        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(filterUsersSpy).toBeCalledWith('user', '10');
    });

    describe('should test user crud', () => {
        test('should get user from db', async () => {
            const res = await request(app).get('/user/1');

            expect(res.status).toEqual(200);
            expect(res.body.login).toEqual('user_1');
        });

        test('should create user', async () => {
            const res = await request(app)
                .post('/user')
                .send({login: 'user_2', password: 'Password_123', age: 14});

            expect(res.status).toEqual(200);
            expect(res.body.login).toEqual('user_2');
        });

        test('should update user', async () => {
            const res = await request(app)
                .put('/user/1')
                .send({login: 'user_22', age: 99});

            expect(res.status).toEqual(200);
            expect(updateUserSpy).toBeCalledWith(1, {login: 'user_22', age: 99});
        });

        test('should fail validation', async () => {
            const res = await request(app)
                .put('/user/1')
                .send({login: 'user_22', age: 131});

            expect(res.status).toEqual(400);
            expect(res.badRequest).toEqual(true);
        });

        test('should delete user', async () => {
            const res = await request(app).delete('/user/1');

            expect(res.status).toEqual(200);
            expect(deleteUsersSpy).toBeCalledWith(1);
        });
    });
});
