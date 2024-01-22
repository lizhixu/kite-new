import {useConfigStore} from "../stores/config";

export function useHead(input) {
    const blogConfig = useConfigStore().config;
    document.title = `${input.title} - ${blogConfig.title}`;

    input.meta.map((item) => {
        if (typeof item.content === 'function') {
            addMeta(item.name, item.content())
        } else {
            addMeta(item.name, item.content)
        }
    })

    const addMeta = (name, content) => {
        const meta = document.createElement('meta');
        meta.content = content;
        meta.name = name;
        document.getElementsByTagName('head')[0].appendChild(meta);
    };
}