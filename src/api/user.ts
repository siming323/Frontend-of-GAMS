import qs from 'qs'
import { AccessoryQueryType, AccessoryType, CategoryQueryType, CategoryType, UserQueryType, UserType } from '../type';
import request from "@/utils/request"

export async function getUserList(params?: UserQueryType) {
    //http://127.0.0.1:4523/m1/4395424-4039824-default/api/accessories?name=xxx&brand=xxx&category=xxx
    return request.get(`/api/users\?${qs.stringify(params)}`);
}

export async function userAdd(params: UserType) {
    return request.post("/api/users", params);
}

export async function userDelete(id: string) {
    return request.delete(`/api/users/${id}`);
}

export async function getUserDetail(id: string) {
    return request.get(`/api/users/${id}`);
}

export async function userUpdate(id: string, params: UserType) {
    return request.put(`/api/users/${id}`, params);
}

export async function login(params: Pick<UserType, "name" | "password">) {
    return request.post(`/api/login`, params);
}

export async function logout() {
    return request.get(`/api/logout`);
}

