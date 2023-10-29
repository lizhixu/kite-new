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