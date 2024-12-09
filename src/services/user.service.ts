import axios from "utils/axios.customize";

const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export const loginAPI = (username: string, password: string) => {
    return axios.post<IBackendRes<ILogin>>(`${baseURL}/auth/login`, { username, password });
}

export const registerAPI = (data: { fullName: string, email: string, password: string, phone: string }) => {
    return axios.post<IBackendRes<IRegister>>(`${baseURL}/user/register`, data);
}

export const fetchAccountAPI = () => {
    return axios.get<IBackendRes<IFetchAccount>>(`${baseURL}/auth/account`);
}