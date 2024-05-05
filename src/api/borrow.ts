import qs from 'qs'
import { BorrowQueryType, BorrowType } from './../type';
import request from "@/utils/request"

export async function getBorrowList(params?: BorrowQueryType) {
    //http://127.0.0.1:4523/m1/4395424-4039824-default/api/accessories?name=xxx&brand=xxx&category=xxx
    return request.get(`/api/borrows\?${qs.stringify(params)}`);
}

export async function borrowAdd(params:BorrowType) {
    return request.post("/api/borrows", params);
}

export async function borrowUpdate(params:BorrowType) {
    return request.put("/api/borrows", params);
}

export async function borrowDelete(id: string) {
    return request.delete(`/api/borrows/${id}`);
}

export async function getBorrowDetail(id: string) {
    return request.get(`/api/borrows/${id}`);
}