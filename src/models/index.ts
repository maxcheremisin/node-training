import {env} from 'config/env';
import {DataTypes, Sequelize} from 'sequelize';
import {AllPermissions} from '../types';
import {UserModel} from './user.model';
import {GroupModel} from './group.model';
import {UserGroupModel} from './user-group.model';

const {
    database: {name, dialect, pass, user},
} = env;

const sequelize = new Sequelize(name, user, pass, {dialect});

class Model {
    public readonly user = UserModel;
    public readonly group = GroupModel;
    public readonly userGroup = UserGroupModel;

    constructor() {
        this.initModels();
        this.initRelations();
    }

    private initModels() {
        this.initGroupModel();
        this.initUserModel();
        this.initUserGroupModel();
    }

    private initRelations() {
        this.group.belongsToMany(this.userGroup, {through: this.userGroup, as: 'users', foreignKey: 'user_id'});
        this.userGroup.belongsToMany(this.group, {through: this.userGroup, as: 'groups', foreignKey: 'group_id'});
    }

    private initUserModel() {
        this.user.init(
            {
                login: {
                    type: DataTypes.STRING,
                    unique: true,
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                password: {
                    type: DataTypes.CHAR,
                },
                age: DataTypes.INTEGER,
                is_deleted: DataTypes.BOOLEAN,
            },
            {sequelize, tableName: 'users', timestamps: false},
        );
    }

    private initGroupModel() {
        this.group.init(
            {
                group_id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    unique: true,
                },
                permissions: {
                    type: DataTypes.ARRAY(DataTypes.ENUM(...AllPermissions)),
                },
            },
            {sequelize, tableName: 'groups', timestamps: false},
        );
    }

    private initUserGroupModel() {
        this.userGroup.init(
            {
                user_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    references: {
                        model: this.user,
                        key: 'user_id',
                    },
                },
                group_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    references: {
                        model: this.group,
                        key: 'group_id',
                    },
                },
            },
            {sequelize, tableName: 'user_group', timestamps: false},
        );
    }
}

export const model = new Model();
