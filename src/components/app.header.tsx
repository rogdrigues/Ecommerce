import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart, FiSun, FiBell, FiMoon } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { MdTranslate } from 'react-icons/md';
import { Badge, Popover, Dropdown, Space, Avatar, Typography, Button, Empty, List } from 'antd';

import { useAppContext } from '@/context/app.context';
import { useNotification } from '@/context/notification.context';
import { logoutAPI } from '@/services';

import 'styles/app.header.scss';
import { useCart } from '@/context/cart.context';
import { useState } from 'react';
import UserProfile from '@/pages/admin/user/_components/user.profile';

const AppHeader = () => {
    const { isAuthenticated, user, setUser, setIsAuthenticated } = useAppContext();
    const [openProfile, setOpenProfile] = useState(false);
    const navigate = useNavigate();
    const notification = useNotification();
    const { cart, removeFromCart } = useCart();

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

    const sharedPopoverContent = (title: string) => (
        <div className="pop-cart-content">
            <Empty description={`Không có ${title}`} />
        </div>
    );

    const handleRemoveFromCart = (id: string) => {
        removeFromCart(id);
    };

    const cartPopoverContent = (
        <div style={{ width: "300px" }}>
            {cart.length > 0 ? (
                <>
                    <List
                        dataSource={cart}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button
                                        danger
                                        size="small"
                                        onClick={() => handleRemoveFromCart(item._id)}
                                    >
                                        Xóa
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.book.thumbnail}`}
                                            alt={item.book.mainText}
                                        />
                                    }
                                    title={
                                        <Typography.Text
                                            ellipsis={{
                                                tooltip: item.book.mainText,
                                            }}
                                            style={{ maxWidth: "180px" }}
                                        >
                                            {item.book.mainText}
                                        </Typography.Text>
                                    }
                                    description={
                                        <div>
                                            <Typography.Text strong style={{ display: "block", marginBottom: "5px" }}>
                                                Giá:{" "}
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(item.book.price * item.quantity)}
                                            </Typography.Text>
                                            <Typography.Text>
                                                Số lượng: {item.quantity}
                                            </Typography.Text>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                    <Button
                        type="primary"
                        block
                        style={{ marginTop: "10px" }}
                        onClick={() => navigate('/order')}
                    >
                        Xem giỏ hàng
                    </Button>
                </>
            ) : (
                <Typography.Text>Không có sản phẩm nào trong giỏ hàng.</Typography.Text>
            )}
        </div>
    );


    const darkModePopoverContent = (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <Button style={{ flex: 1, background: '#f0f0f0', color: '#000' }}>
                <Space>
                    <FiSun style={{ color: '#ffa500' }} /> Sáng
                </Space>
            </Button>
            <Button style={{ flex: 1, background: '#333', color: '#fff' }}>
                <Space>
                    <FiMoon style={{ color: '#808080' }} /> Tối
                </Space>
            </Button>
        </div>
    );

    const languagePopoverContent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button style={{ display: 'flex', justifyContent: 'space-between', background: '#f0f0f0', color: '#000' }}>
                <span>Tiếng Việt</span>
                <MdTranslate style={{ color: '#00aaff' }} />
            </Button>
            <Button style={{ display: 'flex', justifyContent: 'space-between', background: '#f0f0f0', color: '#000' }}>
                <span>日本語</span>
                <MdTranslate style={{ color: '#ff4500' }} />
            </Button>
            <Button style={{ display: 'flex', justifyContent: 'space-between', background: '#f0f0f0', color: '#000' }}>
                <span>English</span>
                <MdTranslate style={{ color: '#32cd32' }} />
            </Button>
        </div>
    );

    const dropdownItems = [
        ...(user?.role === 'ADMIN'
            ? [{ label: <Link to="/admin">Trang quản trị</Link>, key: 'admin' }]
            : []),
        { label: <span onClick={() => { setOpenProfile(true) }}>Quản lý tài khoản</span>, key: 'account' },
        { label: <Link to="/order_view">Lịch sử mua hàng</Link>, key: 'history' },
        { label: <span onClick={handleLogout}>Đăng xuất</span>, key: 'logout' },
    ];

    return (
        <div className="header-container">
            <header className="page-header">
                <div className="header-section header-left" style={{ gap: '30px' }}>
                    <FaReact className="logo-icon" />
                    <span className="logo" onClick={() => navigate('/')}>PJNS</span>
                    <Link to="#" aria-disabled="true" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
                    <Link to="/book" style={{ color: '#fff', textDecoration: 'none' }}>Book</Link>
                    <Link to="/order" style={{ color: '#fff', textDecoration: 'none' }}>Order</Link>
                </div>

                <div className="header-section header-center" style={{ margin: '0 40px' }}>
                    <div className="search-container">
                        <input
                            className="input-search"
                            type="text"
                            placeholder="Tìm sản phẩm, thương hiệu, và tên shop"
                        />
                        <VscSearchFuzzy className="icon-search-inside" />
                    </div>
                </div>

                <div className="header-section header-right" style={{ gap: '25px', paddingRight: '40px' }}>
                    <Popover
                        content={languagePopoverContent}
                        title="Chuyển đổi ngôn ngữ"
                        placement="bottomRight"
                        arrow
                    >
                        <MdTranslate className="header-icon" style={{ fontSize: '1.5em', color: '#fff', cursor: 'pointer' }} />
                    </Popover>
                    <Popover
                        content={darkModePopoverContent}
                        title="Chế độ sáng tối"
                        placement="bottomRight"
                        arrow
                    >
                        <FiSun className="header-icon" style={{ fontSize: '1.5em', color: '#fff', cursor: 'pointer' }} />
                    </Popover>
                    <Popover
                        content={sharedPopoverContent("thông báo")}
                        title="Thông báo"
                        placement="bottomRight"
                        arrow
                    >
                        <Badge count={3} size="small">
                            <FiBell className="header-icon" style={{ fontSize: '1.5em', color: '#61dafb', cursor: 'pointer' }} />
                        </Badge>
                    </Popover>
                    <Popover
                        className="popover-carts"
                        placement="bottomRight"
                        title="Giỏ hàng"
                        content={cartPopoverContent}
                        arrow
                    >
                        <Badge count={cart.length} size="small" showZero>
                            <FiShoppingCart className="icon-cart" style={{ fontSize: '1.5em', color: '#fff', cursor: 'pointer' }} />
                        </Badge>
                    </Popover>
                    {isAuthenticated ? (
                        <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar
                                    style={{ cursor: 'pointer', color: '#f56a00', backgroundColor: '#fde3cf' }}
                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`} />
                                <Typography.Text className="user-name" style={{ color: '#fff' }}>{user?.fullName}</Typography.Text>
                            </Space>
                        </Dropdown>
                    ) : (
                        <span className="login-link" onClick={() => navigate('/login')} style={{ color: '#fff' }}>
                            Tài Khoản
                        </span>
                    )}
                </div>
            </header>
            <UserProfile openProfile={openProfile} setOpenProfile={setOpenProfile} />
        </div>
    );
};

export default AppHeader;
