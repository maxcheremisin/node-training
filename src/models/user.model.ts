import {Model} from 'sequelize';
import {User, UserId} from '../types';

export class UserModel extends Model implements User {
    public user_id!: UserId;
    public login!: string;
    public password!: string;
    public age!: number;
    public is_deleted!: boolean;
}
