import * as types from 'types';
import express from 'express';
import * as UserGroupService from 'services/user-group.service';
import {parseError} from '../helpers';

export class UserGroupController implements types.Controller {
    public readonly router = express.Router();

    constructor() {
        const groupRouter = express.Router();

        groupRouter.post('/:groupId', async (req, res, next) => {
            try {
                const groupId = Number(req.params.groupId) as types.GroupId;
                const userIds = req.query.userIds.split(',').map(Number) as types.UserId[];
                const result = await UserGroupService.addUsersToGroup(groupId, userIds);

                res.status(200).json(result);
            } catch (error) {
                parseError(error, req, res, next);
            }
        });

        this.router.use('/assign', groupRouter);
    }
}
