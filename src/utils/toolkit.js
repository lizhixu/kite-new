import Axios from 'axios'

const baseURL = import.meta.env.MODE === 'development' ? '/toolkit' : import.meta.env.VITE_TK_API_URL;
const service = Axios.create({
    baseURL,
    headers: {'Content-Type': 'application/json'},
});

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        const res = response.data;
        if (res.status && res.status !== 200) {
            Message.error(res.message || '未知错误')
            return Promise.reject(service.interceptors.response.error);
        } else {
            return res;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

export function getBaikeItem(bk_key) {
    return service.get(`/baike/item/` + bk_key);
}

export function getItem(config) {
    return service.request(config);
}