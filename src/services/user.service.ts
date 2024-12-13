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

export const logoutAPI = () => {
    return axios.post<IBackendRes<IRegister>>(`${baseURL}/auth/logout`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUsersAPI = (current: number, pageSize: number, query?: Record<string, any>) => {
    const queryString = query
        ? Object.entries(query)
            .map(([key, value]) => {
                if (typeof value === 'object' && value.$regex) {
                    return `${key}=${encodeURIComponent(`/${value.$regex}/${value.$options || ''}`)}`;
                }
                if (typeof value === 'object' && value.$gte) {
                    return `${key}[$gte]=${encodeURIComponent(value.$gte)}&${key}[$lte]=${encodeURIComponent(value.$lte)}`;
                }
                return `${key}=${encodeURIComponent(value)}`;
            })
            .join('&')
        : '';

    const url = `${baseURL}/user?current=${current}&pageSize=${pageSize}&sort=-createdAt${queryString ? `&${queryString}` : ''}`;

    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(url);
};

export const addUserAPI = (data: { fullName: string, email: string, password: string, phone: string }) => {
    return axios.post<IBackendRes<IUser>>(`${baseURL}/user`, data);
}

export const updateUserAPI = (data: { _id: string, fullName: string, phone: string }) => {
    return axios.put<IBackendRes<IUser>>(`${baseURL}/user`, data);
}


export const bulkImportExcelUserAPI = (data: {
    fullName: string,
    password: string,
    email: string,
    phone: string,
}[]) => {
    return axios.post<IBackendRes<IResponseImport[]>>(`${baseURL}/user/bulk-create`, data);
}