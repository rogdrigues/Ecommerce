import React, { useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    UserOutlined,
    DollarCircleOutlined,
    PicCenterOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar, Breadcrumb, Typography } from 'antd';
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAppContext } from '@/context/app.context';
import { logoutAPI } from '@/services';
import { useNotification } from '@/context/notification.context';
import 'styles/app.header.scss';
const { Content, Footer, Sider } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const { user, setUser, setIsAuthenticated } = useAppContext();
    const notification = useNotification();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await logoutAPI();
            if (res && res.data) {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('access_token');

                notification.success({
                    message: 'Đăng xuất thành công',
                    description: 'Chúc bạn một ngày tốt lành',
                });
                navigate('/');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const sidebarItems = [
        {
            label: <Link to="/admin">Dashboard</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined />,
        },
        {
            label: <Link to="/admin/user">Manage Users</Link>,
            key: 'user',
            icon: <UserOutlined />,
        },
        {
            label: <Link to="/admin/book">Manage Books</Link>,
            key: 'book',
            icon: <ExceptionOutlined />,
        },
        {
            label: <Link to="/admin/order">Manage Orders</Link>,
            key: 'order',
            icon: <DollarCircleOutlined />,
        },
    ];

    const dropdownItems = [
        {
            label: <Text strong>Quản lý tài khoản</Text>,
            key: 'account',
        },
        {
            label: <Link to="/">Trang chủ</Link>,
            key: 'home',
        },
        {
            label: (
                <Space>
                    <Text onClick={handleLogout}>Đăng xuất</Text>
                </Space>
            ),
            key: 'logout',
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }} className="layout-admin">
            <Sider
                theme="light"
                collapsible
                collapsed={collapsed && !hovered}
                width={250}
                collapsedWidth={80}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                trigger={null}
            >
                <div
                    style={{
                        height: 25,
                        margin: 16,
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#3b5998',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <span>PJNS</span>
                    <PicCenterOutlined
                        className={`icon-toggle ${!collapsed ? 'active' : ''}`}
                        style={{
                            cursor: 'pointer',
                            opacity: !collapsed || hovered ? 1 : 0,
                            pointerEvents: !collapsed || hovered ? 'auto' : 'none',
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                        onClick={() => setCollapsed(!collapsed)}
                    />


                </div>

                <Menu
                    selectedKeys={[activeMenu]}
                    mode="inline"
                    items={sidebarItems}
                    onClick={(e) => setActiveMenu(e.key)}
                    style={{ borderRight: 'none' }}
                />
            </Sider>


            <Layout>
                <div
                    className="admin-header"
                    style={{
                        height: "50px",
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 15px",
                        background: "#fff",
                    }}
                >
                    <Space>
                        <Breadcrumb>
                            <Breadcrumb.Item>Admin</Breadcrumb.Item>
                            <Breadcrumb.Item>{activeMenu}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Space>
                    <Space>
                        <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`} />
                                {user?.fullName}
                            </Space>
                        </Dropdown>
                    </Space>
                </div>

                <Content style={{ padding: '20px' }}>
                    <Outlet />
                </Content>

                <Footer style={{ padding: 10, textAlign: "center" }}>
                    PRACTICE REACT - ECOMMERCE ©2024 Created by <HeartTwoTone twoToneColor="#eb2f96" />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
