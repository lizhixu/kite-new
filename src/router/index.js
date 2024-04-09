import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ErrorView from '../views/ErrorView.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            meta: {
                title: '首页'
            },
            component: HomeView
        },
        {
            path: '/404',
            name: 'error',
            meta: {
                title: '404'
            },
            component: ErrorView
        },
        {
            path: '/article_detail/:id',
            name: 'article_detail',
            meta: {
                title: '文章'
            },
            component: () => import('../views/ArticleDetail.vue')
        },
        {
            path: '/special/:special_name',
            name: 'special',
            meta: {
                title: '专题'
            },
            component: () => import('../views/Special.vue')
        },
        {
            path: '/about',
            name: 'about',
            meta: {
                title: 'about'
            },
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
    if (to.matched.length === 0) {  //如果未匹配到路由
        from.name ? next({name: from.name}) : next('/404');   //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
    } else {
        next();    //如果匹配到正确跳转
    }
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
    if (to.name === from.name && to.hash) {
        //锚点不执行跳转
        return
    }
    NProgress.start()
    next()
});

//在路由跳转后用NProgress.done()标记下结束
router.afterEach((to, from) => {
    NProgress.done()
})
export default router
