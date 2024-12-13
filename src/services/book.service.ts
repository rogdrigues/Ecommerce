import axios from "@/utils/axios.customize";

const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBooksAPI = (current: number, pageSize: number, query?: Record<string, any>) => {
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

    const url = `${baseURL}/book?current=${current}&pageSize=${pageSize}&sort=-createdAt${queryString ? `&${queryString}` : ''}`;

    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(url);
};

export const addBookAPI = (bookData: Omit<IBookTable, '_id' | 'createdAt' | 'updatedAt'>) => {
    return axios.post<IBackendRes<IBookTable>>(`${baseURL}/book`, bookData);
};

export const updateBookAPI = (_id: string, bookData: Partial<Omit<IBookTable, 'createdAt' | 'updatedAt'>>) => {
    return axios.put<IBackendRes<IBookTable>>(`${baseURL}/book/${_id}`, bookData);
};

export const deleteBookAPI = (_id: string) => {
    return axios.delete<IBackendRes<IBookTable>>(`${baseURL}/book/${_id}`);
};

export const getBookDetailsAPI = (_id: string) => {
    return axios.get<IBackendRes<IBookTable>>(`${baseURL}/book/${_id}`);
};

export const getBookCategoryAPI = () => {
    return axios.get<IBackendRes<string[]>>(`${baseURL}/database/category`);
};