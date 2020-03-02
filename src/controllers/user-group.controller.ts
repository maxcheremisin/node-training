import express from 'express';
import {ControllerError} from 'services/error-handler.service';
import * as types from 'types';
import * as UserGroupService from 'services/user-group.service';

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
                next(new ControllerError('UserGroup', 'addUsersToGroup', error));
            }
        });

        this.router.use('/assign', groupRouter);
    }
}
