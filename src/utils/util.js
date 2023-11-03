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
    return newHtml;
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
    if (data.attributes !== undefined) {
        return data.attributes[name];
    }
    return '';
}