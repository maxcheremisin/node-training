enum UserBrandId {
    _ = 0,
}

export type UserId = UserBrandId;

export type User = {
    user_id: UserId;
    login: string;
    password: string;
    age: number;
    is_deleted: boolean;
};
