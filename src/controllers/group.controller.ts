import express from 'express';
import {ControllerError} from 'services/error-handler.service';
import * as types from 'types';
import * as GroupValidator from 'validators/group.validator';
import * as GroupService from 'services/group.service';

export class GroupController implements types.Controller {
    public readonly router = express.Router();

    constructor() {
        const groupRouter = express.Router();

        this.attachGroupCrud(groupRouter);
        this.router.use('/group', groupRouter);
    }

    private attachGroupCrud(router: express.Router) {
        const getAll = express.Router();

        router.use(getAll).get('/all', async (req, res, next) => {
            try {
                const groups = await GroupService.getAll();

                res.status(200).json(groups);
            } catch (error) {
                next(new ControllerError('Group', 'getAll', error));
            }
        });

        router.post('/', GroupValidator.validateGroup, async (req, res, next) => {
            try {
                const groupDto = req.body as types.Group;
                const group = await GroupService.createGroup(groupDto);

                res.status(200).json(group);
            } catch (error) {
                next(new ControllerError('Group', 'createGroup', error));
            }
        });

        router
            .route('/:id')
            .get(async (req, res, next) => {
                try {
                    const groupId = Number(req.params.id) as types.GroupId;
                    const group = await GroupService.getGroupById(groupId);

                    res.status(200).json(group);
                } catch (error) {
                    next(new ControllerError('Group', 'getGroupById', error));
                }
            })
            .put(GroupValidator.validateGroup, async (req, res, next) => {
                try {
                    const groupDto = req.body as types.Group;
                    const groupId = Number(req.params.id) as types.GroupId;
                    const group = await GroupService.updateGroup(groupId, groupDto);

                    res.status(200).json(group);
                } catch (error) {
                    next(new ControllerError('Group', 'updateGroup', error));
                }
            })
            .delete(async (req, res, next) => {
                try {
                    const groupId = Number(req.params.id) as types.GroupId;
                    await GroupService.deleteGroup(groupId);

                    res.status(200).json();
                } catch (error) {
                    next(new ControllerError('Group', 'deleteGroup', error));
                }
            });
    }
}
