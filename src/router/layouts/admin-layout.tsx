import React, { useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar } from 'antd';
import { Outlet, useNavigate, Link } from "react-router-dom";
import type { MenuProps } from 'antd';
import { useAppContext } from '@/context/app.context';
import { logoutAPI } from '@/services';
import { useNotification } from '@/context/notification.context';

const { Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
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

    // Menu sidebar
    const sidebarItems: MenuItem[] = [
        {
            label: <Link to="/admin">Dashboard</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined />,
        },
        {
            label: <span>Manage Users</span>,
            key: 'user',
            icon: <UserOutlined />,
            children: [
                {
                    label: <Link to="/admin/user">CRUD</Link>,
                    key: 'crud',
                    icon: <TeamOutlined />,
                },
            ],
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

    // Dropdown menu
    const dropdownItems = [
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => alert("me")}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to="/">Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label style={{ cursor: 'pointer' }} onClick={handleLogout}>Đăng xuất</label>,
            key: 'logout',
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }} className="layout-admin">
            {/* Sidebar */}
            <Sider
                theme="light"
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
            >
                <div style={{ height: 32, margin: 16, textAlign: 'center' }}>Admin</div>
                <Menu
                    defaultSelectedKeys={[activeMenu]}
                    mode="inline"
                    items={sidebarItems}
                    onClick={(e) => setActiveMenu(e.key)}
                />
            </Sider>

            {/* Main layout */}
            <Layout>
                {/* Header */}
                <div
                    className="admin-header"
                    style={{
                        height: "50px",
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 15px",
                    }}
                >
                    <span>
                        {React.createElement(
                            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                            {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            }
                        )}
                    </span>
                    <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
                        <Space style={{ cursor: "pointer" }}>
                            <Avatar src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`} />
                            {user?.fullName}
                        </Space>
                    </Dropdown>
                </div>

                {/* Content */}
                <Content style={{ padding: '15px' }}>
                    <Outlet />
                </Content>

                {/* Footer */}
                <Footer style={{ padding: 0, textAlign: "center" }}>
                    React Test Fresher &copy; Hỏi Dân IT - Made with <HeartTwoTone />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
