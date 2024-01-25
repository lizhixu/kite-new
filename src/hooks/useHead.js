import {useConfigStore} from "../stores/config";

export function useHead(input) {
    const blogConfig = useConfigStore().config;
    document.title = (input.title ? `${input.title} - ` : '') + blogConfig.title;
    input.meta.map((item) => {
        if (typeof item.content === 'function') {
            addMeta(item.name, item.content())
        } else {
            addMeta(item.name, item.content)
        }
    })

    function addMeta(name, content) {
        const curMeta = document.querySelector(`meta[name="${name}"]`);
        if (curMeta) {
            curMeta.setAttribute("content", content);
        } else {
            const meta = document.createElement('meta');
            meta.content = content;
            meta.name = name;
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
    }
}