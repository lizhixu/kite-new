import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import UndrawUi from 'undraw-ui'
import 'undraw-ui/dist/style.css'
import 'nprogress/nprogress.css' //这个样式必须引入

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)
app.use(Avue);

app.use(createPinia())
app.use(router)
app.use(UndrawUi)

app.mount('#app')
