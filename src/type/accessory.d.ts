export interface AccessoryQueryType {
    nam?: string;
    brand?: string;
    category?: number;
    current?: number;
    pageSize?: number;
    all?: boolean;
}

export interface AccessoryType {
    name: string;
    brand: string;
    category: string;
    cover: string;
    madeAt: number;
    stock: number;
    description: string;
    _id?: string
}