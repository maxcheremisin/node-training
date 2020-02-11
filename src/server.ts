import express from 'express';
import {Controller} from 'types';
import {env} from 'config/env';

export class Server {
    public server: express.Application;
    public port: number;

    constructor(controllers: Controller[], port: Server['port']) {
        this.server = express();
        this.port = port;

        this.initializeMiddleware();
        this.initializeControllers(controllers);
    }

    private initializeMiddleware() {
        this.server.use(express.json());
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.server.use(env.api, controller.router);
        });
    }

    public listen(): void {
        this.server.listen(this.port, () => {
            console.log(`Server listening on the port ${this.port}`);
        });
    }
}
