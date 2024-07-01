import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueFroala from 'vue-froala-wysiwyg';

import './components/common/components'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import {useCategoryStore} from "@/stores/category";
import {useConfigStore} from "@/stores/config";

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)

app.use(createPinia())
await useCategoryStore().request();
await useConfigStore().request();
app.use(router)
app.use(VueFroala);
app.mount('#app')
