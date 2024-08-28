import request from "./request";

export const changyan_config = {
    appid: import.meta.env.VITE_CHANGYAN_APPID,
    conf: import.meta.env.VITE_CHANGYAN_CONF
}

export function ssoLogout() {
    return request({
        url: `https://changyan.sohu.com/api/2/sso/logout?client_id=${changyan_config.appid}`,
        method: 'get',
    });
}