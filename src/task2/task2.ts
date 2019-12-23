import express from 'express';
import {User, UserId} from './types';
import {createUser, deleteUser, filterUsers, getUserById, updateUser} from './data';
import {parseError, userPostSchema, userPutSchema, validateUserSchema} from './schema';

const app = express();
const port = Number(process.env.PORT) || 3005;

const userRouter = express.Router();
const userFilterRouter = express.Router();

userRouter.use(userFilterRouter).get('/filter', (req, res, next) => {
    try {
        const filteredUsers = filterUsers(req.query.login, req.query.limit);
        res.status(200).json(filteredUsers);
    } catch (error) {
        parseError(error, req, res, next);
    }
});

userRouter.post('/', validateUserSchema(userPostSchema), (req, res, next) => {
    try {
        const user = createUser(req.body as User);

        res.status(200).json(user);
    } catch (error) {
        parseError(error, req, res, next);
    }
});

userRouter
    .route('/:id')
    .get((req, res, next) => {
        try {
            const user = getUserById(req.params.id as UserId);
            res.status(200).json(user);
        } catch (error) {
            parseError(error, req, res, next);
        }
    })
    .put(validateUserSchema(userPutSchema), (req, res, next) => {
        try {
            const user = updateUser(req.params.id as UserId, req.body as User);

            res.status(200).json(user);
        } catch (error) {
            parseError(error, req, res, next);
        }
    })
    .delete((req, res, next) => {
        try {
            const user = deleteUser(req.params.id as UserId);

            res.status(200).json(user);
        } catch (error) {
            parseError(error, req, res, next);
        }
    });

app.use(express.json());
app.use('/user', userRouter);
app.listen(port, () => console.log(`Server is running on ${port}`));
