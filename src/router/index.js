import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/article_detail/:id',
            name: 'article_detail',
            component: () => import('../views/ArticleDetail.vue')
        },
        {
            path: '/special/:special_name',
            name: 'special',
            component: () => import('../views/Special.vue')
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        }
    ]
})
router.beforeEach((to, from, next) => {
    // 让页面回到顶部
    document.documentElement.scrollTop = 0;
    next();
});

NProgress.configure({
    easing: 'ease',  // 动画方式
    speed: 500,  // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
})

//在路由跳转前用NProgress.start()标记下进度条开始
router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
});

//在路由跳转后用NProgress.done()标记下结束
router.afterEach((to, from) => {
    NProgress.done()
})
export default router
