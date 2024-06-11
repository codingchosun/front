import axios from 'axios';

const API_BASE_URL = 'http://localhost:8090';
// 로컬  'http://localhost:8090'
// 서버 'http://13.125.230.216:8080'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;