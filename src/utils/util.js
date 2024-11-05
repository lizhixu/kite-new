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

export function loadJs(url, cb, id) {
    try {
        const c = document.getElementsByTagName("head")[0] || document.head || document.documentElement;
        const b = document.createElement("script");
        b.setAttribute("type", "text/javascript");
        b.setAttribute("charset", "UTF-8");
        b.setAttribute("src", url);
        id && b.setAttribute("id", id);
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

/**
 * 获取 attributes img信息
 * @param data
 * @param name
 * @returns {*|string}
 */
export function getAttributesImg(data, name) {
    const cdn_domain = import.meta.env.VITE_CDN_DOMAIN;
    return cdn_domain + getAttributes(getAttributes(data, name).data, 'url');
}

/**
 * 将字符串中的特殊字符转义
 *
 * 此函数用于将字符串中的特殊字符转换成其对应的转义序列
 * 这在许多场景下都是非常有用的，比如在处理JSON数据、
 * 正则表达式或者在Web页面中动态生成HTML内容时，确保数据的正确性和安全性
 *
 * @param {string} str 需要进行转义处理的字符串
 * @returns {string} 转义处理后的字符串
 */
export function escapeString(str) {
    // 替换反斜杠为双反斜杠，以避免反斜杠被解释为转义字符
    return str
        .replace(/\\/g, '\\\\') // 替换反斜杠
        .replace(/"/g, '\\"') // 替换双引号，防止在双引号字符串中引起错误
        .replace(/'/g, "\\'") // 替换单引号，防止在单引号字符串中引起错误
        .replace(/\n/g, '\\n') // 替换换行符，用于文本数据的正确显示
        .replace(/\r/g, '\\r') // 替换回车符，与换行符一起用于文本数据的格式化
        .replace(/\t/g, '\\t') // 替换制表符，用于保持空格的格式
        .replace(/\f/g, '\\f') // 替换换页符，用于文档打印等场景
        .replace(/\v/g, '\\v'); // 替换垂直制表符，用于文档格式化
}
