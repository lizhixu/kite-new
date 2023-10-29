import request from '@/utils/request';

export function find(model, params = {}) {
    return request({
        url: `/${model}`,
        method: 'get',
        params: params,
    });
}

export function findOne(model, id) {
    return request({
        url: `/${model}${id}`,
        method: 'get',
    });
}

export function count(model, params = {}) {
    return request({
        url: `/${model}/count`,
        method: 'get',
        params: params,
    });
}

export function create(model, data) {
    return request({
        url: `/${model}`,
        method: 'post',
        data: data,
    });
}

export function update(model, id, data) {
    return request({
        url: `/${model}/${id}`,
        method: 'put',
        data: data,
    });
}

export function deleted(model, id) {
    return request({
        url: `/${model}/${id}`,
        method: 'delete'
    });
}