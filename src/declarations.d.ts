declare module 'sequelize-mock' {
    declare class SequelizeMock {
        public define(name: string, defaultValues: object, options?: object);
    }

    export = SequelizeMock;
}
