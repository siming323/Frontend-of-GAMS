import { AccessoryType } from "./accessory";

export interface BorrowQueryType {
    nam?: string;
    brand?: string;
    category?: number;
    current?: number;
    pageSize?: number;
}

export interface BorrowType {
    accessory: AccessoryType;
    borrowAt: number;
    returnAt: number;
    user: any;
}