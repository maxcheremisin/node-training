import {Model} from 'sequelize';
import {Group, GroupId, Permission} from 'types';

export class GroupModel extends Model implements Group {
    public group_id!: GroupId;
    public name!: string;
    public permissions!: Permission[];
}
