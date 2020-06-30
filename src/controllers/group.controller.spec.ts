import request from 'supertest';
import express from 'express';
import * as types from 'types';
import * as GroupService from 'services/group.service';
import {GroupController} from './group.controller';

const controller = new GroupController();
const app = express();

app.use(express.json());
app.use(controller.router);

jest.mock('../models', () => {
    const SequelizeMock = require('sequelize-mock'); // eslint-disable-line
    const dbMock = new SequelizeMock();
    const groupDefaultAttributes: types.Group = {
        group_id: 1 as types.GroupId,
        name: 'group_1',
        permissions: ['READ'],
    };

    const groupMock = dbMock.define('groups', groupDefaultAttributes, {tableName: 'groups', timestamps: false});

    return {
        model: {
            group: groupMock,
        },
    };
});

const updateGroupSpy = jest.spyOn(GroupService, 'updateGroup');
const getAllGroupsSpy = jest.spyOn(GroupService, 'getAll');
const deleteGroupSpy = jest.spyOn(GroupService, 'deleteGroup');

describe('should test group controller', () => {
    test('should get all groups', async () => {
        const res = await request(app).get('/group/all');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(getAllGroupsSpy).toHaveBeenCalledWith();
    });

    describe('should test group crud', () => {
        test('should get group from db', async () => {
            const res = await request(app).get('/group/1');

            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual('group_1');
        });

        test('should create group', async () => {
            const res = await request(app)
                .post('/group')
                .send({name: 'group_2', permissions: ['READ', 'WRITE']});

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('group_2');
            expect(res.body.permissions).toContain('WRITE');
        });

        test('should update group', async () => {
            const res = await request(app)
                .put('/group/1')
                .send({name: 'group_22', permissions: []});

            expect(res.status).toBe(200);
            expect(updateGroupSpy).toBeCalledWith(1, {name: 'group_22', permissions: []});
        });

        test('should fail validation', async () => {
            const res = await request(app)
                .put('/group/1')
                .send({name: 'group_22', permissions: ['WRiTE']});

            console.log(res.error);

            expect(res.status).toBe(400);
            expect(res.badRequest).toEqual(true);
        });

        test('should delete group', async () => {
            const res = await request(app).delete('/group/1');

            expect(res.status).toBe(200);
            expect(deleteGroupSpy).toBeCalledWith(1);
        });
    });
});
