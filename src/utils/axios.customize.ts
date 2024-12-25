import { refreshToken } from "@/services";
import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});


instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    const token = localStorage.getItem('access_token');
    const auth = token ? `Bearer ${token}` : '';
    config.headers['Authorization'] = auth;
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response.data) {
        return response.data;
    }
    return response;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.config && error.response && error.response.status === 401) {
        const access_token = await refreshToken();
        if (access_token) {
            localStorage.setItem('access_token', access_token);
            error.config.headers['Authorization'] = `Bearer ${access_token}`;
            return instance.request(error.config);
        }
    }
    return Promise.reject(error);
});

export default instance;