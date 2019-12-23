enum UserBrandId {
    _ = '',
}

export type UserId = UserBrandId;

export type User = {
    id: UserId;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
};
