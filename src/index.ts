import {Server} from 'server';
import {UserController} from 'controllers/user.controller';
import {GroupController} from 'controllers/group.controller';
import {UserGroupController} from 'controllers/user-group.controller';
import {AuthController} from 'controllers/auth.controller';
import {Logger} from 'services/logger.service';
import {env} from 'config/env';

const server = new Server([new UserController(), new GroupController(), new UserGroupController(), new AuthController()], env.port);

server.listen();

process
    .on('unhandledRejection', (reason, promise) => {
        Logger.error(`${reason} Unhandled Rejection at Promise ${promise}`);
    })
    .on('uncaughtException', error => {
        Logger.error(`${error} Uncaught Exception thrown`);
        process.exit(1);
    });
