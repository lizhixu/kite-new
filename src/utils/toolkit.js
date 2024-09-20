import Axios from 'axios'

const baseURL = import.meta.env.MODE === 'development' ? '/toolkit' : import.meta.env.VITE_TK_API_URL;
const service = Axios.create({
    baseURL,
    headers: {'Content-Type': 'application/json'},
});

export function getBaikeItem(bk_key) {
    return service.get(`/baike/item/` + bk_key);
}