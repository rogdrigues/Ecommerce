import { useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    UserOutlined,
    DollarCircleOutlined,
    BorderOuterOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar, Breadcrumb, Typography } from 'antd';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/app.context';
import { logoutAPI } from '@/services';
import { useNotification } from '@/context/notification.context';
import 'styles/admin-layout.scss';
import UserProfile from '@/pages/admin/user/_components/user.profile';

const { Content, Footer, Sider } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const { user, setUser, setIsAuthenticated } = useAppContext();
    const notification = useNotification();
    const navigate = useNavigate();
    const [openProfile, setOpenProfile] = useState(false);

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
            console.error(err);
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
            label: <Text strong onClick={() => { setOpenProfile(true) }}>Quản lý tài khoản</Text>,
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
        <>
            <Layout className="layout-admin">
                <Sider
                    theme="light"
                    collapsible
                    collapsed={collapsed && !hovered}
                    width={250}
                    collapsedWidth={80}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    trigger={null}
                    style={{
                        position: 'fixed',
                        height: '100vh',
                        left: 0,
                    }}
                >
                    <div className="sidebar-header">
                        <span>PJNS</span>
                        <BorderOuterOutlined
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
                        style={{ flexGrow: 1, overflowY: 'auto', height: 'calc(100vh - 135px)' }}
                    />
                    <div className="admin-footer">
                        <Dropdown menu={{ items: dropdownItems }} trigger={['click']} placement="topLeft" arrow>
                            <Space
                                className="user-info"
                                direction="horizontal"
                                align="center"
                                style={{
                                    width: '100%',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                }}
                            >
                                <Avatar
                                    className="avatar"
                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`}
                                />
                                <div style={{ textAlign: 'left', transition: 'opacity 0.5s, width 0.5s' }}>
                                    <Typography.Text
                                        strong
                                        style={{
                                            display: collapsed && !hovered ? 'none' : 'block',
                                            opacity: !collapsed || hovered ? 1 : 0,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {user?.fullName}
                                    </Typography.Text>
                                    <Typography.Text
                                        type="secondary"
                                        style={{
                                            display: collapsed && !hovered ? 'none' : 'block',
                                            opacity: !collapsed || hovered ? 1 : 0,
                                            fontSize: '0.8rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {user?.role?.toUpperCase()}
                                    </Typography.Text>
                                </div>
                            </Space>
                        </Dropdown>
                    </div>
                </Sider>

                <Layout style={{
                    marginLeft: !collapsed || hovered ? 250 : 80,
                    height: '100vh',
                    overflow: 'hidden',
                    transition: 'margin-left 0.2s'
                }}>
                    <Content
                        style={{
                            padding: 16,
                            overflowY: 'auto',
                            height: 'calc(100vh - 145px)',
                        }}
                    >
                        <Breadcrumb
                            className="breadcrumb"
                            items={[
                                { title: 'Admin' },
                                { title: activeMenu },
                            ]}
                        />
                        <Outlet />
                    </Content>
                    <Footer className="footer">
                        PRACTICE REACT - ECOMMERCE ©{new Date().getFullYear()} Created by{' '}
                        <HeartTwoTone twoToneColor="#eb2f96" />
                    </Footer>
                </Layout>
            </Layout>
            <UserProfile openProfile={openProfile} setOpenProfile={setOpenProfile} />
        </>
    );
};

export default AdminLayout;
