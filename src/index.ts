import {Server} from 'server';
import {UserController} from 'controllers/user.controller';
import {GroupController} from 'controllers/group.controller';
import {UserGroupController} from 'controllers/user-group.controller';
import {env} from 'config/env';

const server = new Server([new UserController(), new GroupController(), new UserGroupController()], env.port);

server.listen();
