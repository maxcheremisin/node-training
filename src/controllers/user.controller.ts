import express from 'express';
import {ControllerError} from 'services/error-handler.service';
import * as types from 'types';
import * as UserValidator from 'validators/user.validator';
import * as UserService from 'services/user.service';

export class UserController implements types.Controller {
    public readonly router = express.Router();

    constructor() {
        const userRouter = express.Router();

        this.attachRoutes(userRouter);
        this.router.use('/user', userRouter);
    }

    private attachRoutes(router: express.Router) {
        this.attachSuggestionFilter(router);
        this.attachUserCrud(router);
    }

    private attachSuggestionFilter(router: express.Router) {
        const filterRouter = express.Router();

        router.use(filterRouter).get('/filter', async (req, res, next) => {
            try {
                const login = req.query.login;
                const limit = req.query.limit;
                const filteredUsers = await UserService.filterUsers(login, limit);

                res.status(200).json(filteredUsers);
            } catch (error) {
                next(new ControllerError('User', 'filterUsers', error));
            }
        });
    }

    private attachUserCrud(router: express.Router) {
        router.post('/', UserValidator.createUser, async (req, res, next) => {
            try {
                const userDto = req.body as types.User;
                const user = await UserService.createUser(userDto);

                res.status(200).json(user);
            } catch (error) {
                next(new ControllerError('User', 'createUser', error));
            }
        });

        router
            .route('/:id')
            .get(async (req, res, next) => {
                try {
                    const userId = Number(req.params.id) as types.UserId;
                    const user = await UserService.getUserById(userId);

                    res.status(200).json(user);
                } catch (error) {
                    next(new ControllerError('User', 'getUserById', error));
                }
            })
            .put(UserValidator.updateUser, async (req, res, next) => {
                try {
                    const userDto = req.body as types.User;
                    const userId = Number(req.params.id) as types.UserId;
                    const user = await UserService.updateUser(userId, userDto);

                    res.status(200).json(user);
                } catch (error) {
                    next(new ControllerError('User', 'updateUser', error));
                }
            })
            .delete(async (req, res, next) => {
                try {
                    const userId = Number(req.params.id) as types.UserId;
                    await UserService.deleteUser(userId);

                    res.status(200).json();
                } catch (error) {
                    next(new ControllerError('User', 'deleteUser', error));
                }
            });
    }
}
