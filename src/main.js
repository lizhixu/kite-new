import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import UndrawUi from 'undraw-ui'
import 'undraw-ui/dist/style.css'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import {useCategoryStore} from "@/stores/category";

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)
app.use(Avue);
app.use(UndrawUi)

app.use(createPinia())
useCategoryStore().request();
app.use(router)

app.mount('#app')
