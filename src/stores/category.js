import {ref} from 'vue'
import {defineStore} from 'pinia'
import {find} from "@/utils/strapi";
import _ from 'lodash-es'

export const useCategoryStore = defineStore('category', () => {
    const categories = ref({});

    async function request() {
        const res = await find('categories', {
            populate: '*'
        });
        _.map(res.data, (value) => {
            categories.value[value.id] = value;
        })
    }

    return {categories, request}
})
