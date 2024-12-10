import React, { createContext, useContext } from 'react';
import { notification } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';

const NotificationContext = createContext<NotificationInstance | null>(null);
interface IProps {
    children: React.ReactNode;
}
export const NotificationProvider = (props: IProps) => {
    const [api, contextHolder] = notification.useNotification();

    return (
        <NotificationContext.Provider value={api}>
            {contextHolder}
            {props.children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const api = useContext(NotificationContext);
    if (!api) {
        throw new Error('useGlobalNotification must be used within a NotificationProvider');
    }
    return api;
};
