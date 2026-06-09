import axios from 'axios';

// Point to your local Node.js Express server
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Interceptor: Automatically attach the JWT token to every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
