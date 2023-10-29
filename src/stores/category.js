import {ref} from 'vue'
import {defineStore} from 'pinia'
import {find} from "@/utils/strapi";
import _ from 'lodash'

export const useCategoryStore = defineStore('category', () => {
    const categories = ref({});

    function request() {
        find('categories', {
            populate: '*'
        }).then((res) => {
            _.map(res.data, (value) => {
                categories.value[value.id] = value;
            })
        });
    }

    return {categories, request}
})
