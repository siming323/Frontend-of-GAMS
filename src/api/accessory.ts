import qs from 'qs'
import { AccessoryQueryType, AccessoryType } from './../type';
import request from "@/utils/request"

export async function getAccessoryList(params?: AccessoryQueryType) {
    //http://127.0.0.1:4523/m1/4395424-4039824-default/api/accessories?name=xxx&brand=xxx&category=xxx
    return request.get(`/api/accessories\?${qs.stringify(params)}`);
}

export async function accessoryAdd(params:AccessoryType) {
    return request.post("/api/accessories", params);
}

export async function accessoryDelete(id: string) {
    return request.delete(`/api/accessories/${id}`);
}

export async function getAccessoryDetail(id: string) {
    return request.get(`/api/accessories/${id}`);
}

export async function accessoryUpdate(id: string, params: AccessoryType) {
    return request.put(`/api/accessories/${id}`, params);
}