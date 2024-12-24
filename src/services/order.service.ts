import axios from "@/utils/axios.customize";

const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;
const paymentURL = `${import.meta.env.VITE_BACKEND_PAYMENT_URL}`;
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

export const getVNPayUrlAPI = (amount: number, locale: string, paymentRef: string) => {
    const urlBackend = `${paymentURL}/vnpay/payment-url`;
    return axios.post<IBackendRes<{ url: string }>>(urlBackend,
        { amount, locale, paymentRef })
}

export const createOrderAPI = (orderData: IOrder) => {
    return axios.post<IBackendRes<IOrder>>(`${baseURL}/order`, orderData,
        {
            headers: {
                delay: '3000'
            }
        }
    );
}

export const updatePaymentOrderAPI = (paymentStatus: string, paymentRef: string) => {
    return axios.post<IBackendRes<IOrder>>(`${baseURL}/order/update-payment-status`, { paymentStatus, paymentRef });
}