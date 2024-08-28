import request from "./request";
import {loadJs} from "./util";

export const changyan_config = {
    appid: import.meta.env.VITE_CHANGYAN_APPID,
    conf: import.meta.env.VITE_CHANGYAN_CONF
}

export function ssoLogout() {
    const count_url = `https://changyan.sohu.com/api/2/sso/logout?client_id=${changyan_config.appid}`;
    const img = new Image();
    img.src = count_url;
    return request({
        url: count_url,
        method: 'get',
    });
}

export function loadComment() {
    window.changyan = undefined;
    window.cyan = undefined;
    loadJs("https://changyan.sohu.com/upload/changyan.js", () => {
        window.changyan.api.config(changyan_config);
    }, 'changyan_pc_js')
}

export function loadCommentCount() {
    loadJs(`https://cy-cdn.kuaizhan.com/upload/plugins/plugins.list.count.js?clientId=${changyan_config.appid}`, null, 'cy_cmt_num')
}