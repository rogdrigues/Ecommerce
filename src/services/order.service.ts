import axios from "@/utils/axios.customize";

const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getOrdersAPI = (current: number, pageSize: number, query?: Record<string, any>) => {
    const queryString = query
        ? Object.entries(query)
            .map(([key, value]) => {
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            })
            .join("&")
        : "";

    const url = `${baseURL}/order?current=${current}&pageSize=${pageSize}${queryString ? `&${queryString}` : ''}`;

    return axios.get<IBackendRes<IModelPaginate<IOrderHistory>>>(url);
};