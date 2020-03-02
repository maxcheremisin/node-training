import express from 'express';
import {Controller} from 'types';
import {Logger} from 'services/logger.service';
import {env} from 'config/env';
import {handleControllerError, handleError} from 'services/error-handler.service';

export class Server {
    public server: express.Application;
    public port: number;

    constructor(controllers: Controller[], port: Server['port']) {
        this.server = express();
        this.port = port;

        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandler();
    }

    private initializeMiddleware() {
        this.server.use(express.json());
        this.server.use((req, res, next) => {
            Logger.info(`Request ${req.method} ${req.url}`);
            next();
        });
    }

    private initializeErrorHandler() {
        this.server.use(handleError);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.server.use(env.api, controller.router);
            controller.router.use(handleControllerError);
        });
    }

    public listen(): void {
        this.server.listen(this.port, () => {
            console.log(`Server listening on the port ${this.port}`);
        });
    }
}
