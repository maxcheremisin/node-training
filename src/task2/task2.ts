import express from 'express';
import {User, UserId} from './types';
import {createUser, deleteUser, filterUsers, getUserById, updateUser} from './data';
import {parseError, userPostSchema, userPutSchema, validateUserSchema} from './schema';

const app = express();
const port = Number(process.env.PORT) || 3005;

const userRouter = express.Router();
const userFilterRouter = express.Router();

userRouter.use(userFilterRouter).get('/filter', async (req, res, next) => {
    try {
        const filteredUsers = await filterUsers(req.query.login, req.query.limit);
        res.status(200).json(filteredUsers);
    } catch (error) {
        parseError(error, req, res, next);
    }
});

userRouter.post('/', validateUserSchema(userPostSchema), async (req, res, next) => {
    try {
        const user = await createUser(req.body as User);
        res.status(200).json(user);
    } catch (error) {
        parseError(error, req, res, next);
    }
});

userRouter
    .route('/:id')
    .get(async (req, res, next) => {
        try {
            const user = await getUserById(Number(req.params.id) as UserId);
            res.status(200).json(user);
        } catch (error) {
            parseError(error, req, res, next);
        }
    })
    .put(validateUserSchema(userPutSchema), async (req, res, next) => {
        try {
            const user = await updateUser(Number(req.params.id) as UserId, req.body as User);

            res.status(200).json(user);
        } catch (error) {
            parseError(error, req, res, next);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const user = await deleteUser(Number(req.params.id) as UserId);

            res.status(200).json(user);
        } catch (error) {
            parseError(error, req, res, next);
        }
    });

app.use(express.json());
app.use('/user', userRouter);
app.listen(port, () => console.log(`Server is running on ${port}`));
