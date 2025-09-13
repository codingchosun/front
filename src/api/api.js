import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8090';
axios.defaults.withCredentials = true;

const API_BASE_URL = 'http://localhost:8090';
// 로컬  'http://localhost:8090'
// 서버 'http://13.125.230.216:8080'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// const api_formdata= axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         'Content-Type': 'multipart/form-data',
//     },
// });

// 로그인 확인 백엔드 API 호출
export const checkUserStatus = () => {
    return axios.get('/api/me');
};

export default api;