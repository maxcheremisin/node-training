import express from 'express';
import * as types from 'types';
import * as GroupValidator from 'validators/group.validator';
import * as GroupService from 'services/group.service';
import {parseError} from 'helpers';

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
                parseError(error, req, res, next);
            }
        });

        router.post('/', GroupValidator.validateGroup, async (req, res, next) => {
            try {
                const groupDto = req.body as types.Group;
                const group = await GroupService.createGroup(groupDto);

                res.status(200).json(group);
            } catch (error) {
                parseError(error, req, res, next);
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
                    parseError(error, req, res, next);
                }
            })
            .put(GroupValidator.validateGroup, async (req, res, next) => {
                try {
                    const groupDto = req.body as types.Group;
                    const groupId = Number(req.params.id) as types.GroupId;
                    const group = await GroupService.updateGroup(groupId, groupDto);

                    res.status(200).json(group);
                } catch (error) {
                    parseError(error, req, res, next);
                }
            })
            .delete(async (req, res, next) => {
                try {
                    const groupId = Number(req.params.id) as types.GroupId;
                    await GroupService.deleteGroup(groupId);

                    res.status(200).json();
                } catch (error) {
                    parseError(error, req, res, next);
                }
            });
    }
}
