export interface UserQueryType {
    name?: string;
    status?: number;
    current?: number;
    pageSize?: numberl;
}

export interface UserType {
    name:string;
    password: string;
    status: 'on' | 'off';
    nickName: string;
    _id?: string;
    gender: USER_GENDER.MALE,
    role: USER_ROLE.USER,
    status: USER_STATUS.ON,
}