import request from "./request";
import {loadJs} from "./util";

export const changyan_config = {
    appid: import.meta.env.VITE_CHANGYAN_APPID,
    conf: import.meta.env.VITE_CHANGYAN_CONF
}

export function ssoLogout() {
    const count_url = `https://changyan.kuaizhan.com/api/2/sso/logout?callback=changyanLogout&client_id=${changyan_config.appid}&_=${new Date().getTime()}`;
    loadJs(count_url)
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
    loadJs("https://changyan.kuaizhan.com/upload/changyan.js", () => {
        window.changyan.api.config(changyan_config);
        const style = document.createElement('style')
        style.type = 'text/css'
        style.appendChild(document.createTextNode('#SOHUCS #SOHU_MAIN img{\n' +
            'overflow: hidden !important;\n' +
            '}'))
        const head = document.getElementsByTagName('head')[0]
        head.appendChild(style)
    }, 'changyan_pc_js')
}

export function loadCommentCount() {
    loadJs(`https://cy-cdn.kuaizhan.com/upload/plugins/plugins.list.count.js?clientId=${changyan_config.appid}`, null, 'cy_cmt_num')
}