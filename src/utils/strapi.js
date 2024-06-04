import request from './request';

export function find(model, params = {}) {
    return request({
        url: `/${model}`,
        method: 'get',
        params: params,
    });
}

export function findOne(model, id, params = {}) {
    return request({
        url: `/${model}/${id}`,
        method: 'get',
        params: params,
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
        data: {
            data: data
        },
    });
}

export function deleted(model, id) {
    return request({
        url: `/${model}/${id}`,
        method: 'delete'
    });
}

/**
 * 注册
 * @param data
 * @returns {*}
 */
export function register(data) {
    return request({
        url: '/auth/local/register',
        method: 'post',
        data: data,
    });
}

/**
 * 登录
 * @param data
 * @returns {*}
 */
export function login(data) {
    return request({
        url: '/auth/local',
        method: 'post',
        data: data
    });
}