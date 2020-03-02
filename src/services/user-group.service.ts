import {GroupId, UserId} from 'types';
import {model} from 'models';
import {handleSequelizeError} from 'services/error-handler.service';

export function addUsersToGroup(groupId: GroupId, userIds: UserId[]) {
    const promises: Promise<typeof model.userGroup>[] = [];

    userIds.forEach(userId => {
        promises.push(model.userGroup.create({user_id: userId, group_id: groupId}).catch(handleSequelizeError()));
    });

    return Promise.all(promises);
}
