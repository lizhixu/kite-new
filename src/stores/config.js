import {ref} from 'vue'
import {defineStore} from 'pinia'
import {find} from "@/utils/strapi";

export const useConfigStore = defineStore('config', () => {
    const config = ref(null);

    async function request() {
        config.value = (await find('blog-config', {populate: '*'})).data.attributes;
    }

    return {
        config, request
    }
})
