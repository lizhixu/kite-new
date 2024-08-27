import _ from "lodash-es";
import Cookies from "js-cookie";

export const app_path = import.meta.env.VITE_APP_URL;
export const api_path = import.meta.env.VITE_API_URL;
export const cdn_path = import.meta.env.VITE_CDN_DOMAIN;
export const multiavatar_path = import.meta.env.VITE_DICEBEAR_DOMAIN;
/**
 * 移除dom
 * @param html
 * @returns {string}
 */
export const fremoveHtmlStyle = (html) => {
    let relStyle = /style\s*?=\s*?([‘"])[\s\S]*?\1/g; //去除样式
    let relTag = /<.+?>/g; //去除标签
    let relClass = /class\s*?=\s*?([‘"])[\s\S]*?\1/g;// 清除类名
    let newHtml = "";
    if (html) {
        newHtml = html.replace(relStyle, "");
        newHtml = newHtml.replace(relTag, '');
        newHtml = newHtml.replace(relClass, '');
    }
    let temp = document.createElement("div");
    temp.innerHTML = newHtml;
    return temp.innerText || temp.textContent;
};

/**
 * 从md中获取图片
 * @param markdownText
 * @returns {[]}
 */
export function extractImagesFromMarkdown(markdownText) {
    let imageRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    let images = [];

    while ((match = imageRegex.exec(markdownText)) !== null) {
        let src = match[1];
        images.push(src);
    }
    return images;
}

/**
 * 获取 attributes 信息
 * @param data
 * @param name
 * @returns {*|string}
 */
export function getAttributes(data, name) {
    if (data?.attributes !== undefined) {
        return data.attributes[name];
    }
    return '';
}

export function loadJs(url, cb) {
    try {
        const c = document.getElementsByTagName("head")[0] || document.head || document.documentElement;
        const b = document.createElement("script");
        b.setAttribute("type", "text/javascript");
        b.setAttribute("charset", "UTF-8");
        b.setAttribute("src", url);
        b.setAttribute("id", 'changyan_pc_js');
        if (window.attachEvent) {
            b.onreadystatechange = function () {
                const e = b.readyState;
                if (e === "loaded" || e === "complete") {
                    b.onreadystatechange = null;
                    cb && cb();
                }
            }
        } else {
            if (cb) {
                b.onload = cb
            }
        }
        c.appendChild(b)
    } catch (error) {
        cb && cb();
    }
}

export function findHTags(node) {
    if (!node) {
        return [];
    }
    // 创建H标签对象
    const hTag = [];
    let curChild = [];
    node.forEach((item) => {
        let lastNode = _.last(hTag);
        let curIndex = hTag.length - 1;
        let curLevel = parseInt(item.tagName.replace('H', ''));
        if (lastNode && curLevel > lastNode.level) {
            curChild.push(item);
        } else {
            if (curChild.length > 0) {
                hTag[curIndex].children = [];
                hTag[curIndex].children.push(...findHTags(curChild) ?? []);
                curChild = [];
            }
            hTag.push({
                level: curLevel,
                text: item.innerText,
                id: item.firstChild.id,
                offsetTop: item.offsetTop
            })
        }
    })
    return hTag;
}

/**
 * 组装用户头像
 * @param user
 * @returns {*}
 */
export function assembleTheAvatar(user) {
    user.avatar_url = user?.avatar ? (cdn_path + user.avatar.url) : (multiavatar_path + user?.username);
    return user;
}

/**
 * 清除缓存
 */
export function deleteCache() {
    const domain = import.meta.env.MODE === 'development' ? '' : app_path.replace('https://', '.');
    const api = Cookies.withAttributes({path: '/', domain: domain})
    localStorage.removeItem('token');
    api.remove('token');
}