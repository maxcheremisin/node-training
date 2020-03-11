export type UserId = number & {readonly __brand: unique symbol};

export type User = {
    user_id: UserId;
    login: string;
    password: string;
    age: number;
    is_deleted: boolean;
};

export const AllPermissions = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'] as const;
export type Permission = typeof AllPermissions extends ReadonlyArray<infer P> ? P : never;

export type GroupId = number & {readonly __brand: unique symbol};

export type Group = {
    group_id: GroupId;
    name: string;
    permissions: readonly Permission[];
};

export type AuthParams = Pick<User, 'login' | 'password'>;
