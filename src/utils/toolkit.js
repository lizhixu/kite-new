import Axios from 'axios'

const baseURL = import.meta.env.MODE === 'development' ? '' : import.meta.env.VITE_BAIKE_API_URL;
const service = Axios.create({
    baseURL: baseURL + '/toolkit',
    headers: {'Content-Type': 'application/json'},
});

export function getBaikeItem(bk_key) {
    return service.get(`/baike/item/` + bk_key);
}