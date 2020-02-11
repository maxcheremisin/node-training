import {Model} from 'sequelize';
import {Group, GroupId, User, UserId} from 'types';

export class UserGroupModel extends Model implements Pick<Group, 'group_id'>, Pick<User, 'user_id'> {
    public group_id!: GroupId;
    public user_id!: UserId;
}
