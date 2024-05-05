import qs from 'qs'
import { AccessoryQueryType, AccessoryType, CategoryQueryType, CategoryType } from '../type';
import request from "@/utils/request"

export async function getCategoryList(params?: CategoryQueryType) {
    //http://127.0.0.1:4523/m1/4395424-4039824-default/api/accessories?name=xxx&brand=xxx&category=xxx
    return request.get(`/api/categories\?${qs.stringify(params)}`);
}

export async function categoryAdd(params: CategoryType) {
    return request.post("/api/categories", params);
}

export async function categoryDelete(id: string) {
    return request.delete(`/api/categories/${id}`);
}

export async function getCategoryDetail(id: string) {
    return request.get(`/api/categories/${id}`);
}

export async function categoryUpdate(id: string, params: CategoryType) {
    return request.put(`/api/categories/${id}`, params);
}