import Axios from 'axios'

const axios = Axios;

const service = Axios.create({
    baseURL: '/api',
    timeout: 5000,
    headers: {'Content-Type': 'application/json'},
});

// 添加请求拦截器
service.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        config.headers.Authorization = `bearer ${import.meta.env.VITE_API_TOKEN}`;
        return config
    },
    function (error) {
        // 对请求错误做些什么
        console.log(error)
        return Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        const res = response.data;
        if (res.status && res.status !== 200) {
            Message.error(res.message || '未知错误')
            // `token` 过期或者账号已在别处登录
            if (res.status === 203) {
                // 清除浏览器全部临时缓存
                Session.clear();
                router.push('/login');
                store.commit('setMenuData', {});
                resetRouter(); // 重置路由
                MessageBox.alert('你已被登出，请重新登录', '提示', {})
                    .then(() => {
                    })
                    .catch(() => {
                    });
            }
            return Promise.reject(service.interceptors.response.error);
        } else {
            return res;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default service;