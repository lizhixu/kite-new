import {ref} from 'vue'
import {defineStore} from 'pinia'
import {find} from "@/utils/strapi";

export const useConfigStore = defineStore('config', () => {
    const config = ref(null);

    function request() {
        find('blog-config', {populate: '*'}).then((res) => {
            config.value = res.data.attributes;
        });
    }

    return {
        config, request
    }
})
