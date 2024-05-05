export interface CategoryQueryType {
    name?: string;
    level?: number;
    current?: number;
    pageSize?: numberl;
    all?: boolean;
}

export interface CategoryType {
    name:string;
    level: 1 | 2;
    parent: CategoryType;
    _id?: string;
}