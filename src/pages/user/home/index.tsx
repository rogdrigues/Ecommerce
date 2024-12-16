import { useNavigate } from 'react-router-dom';
import 'styles/home.page.scss';
import { FaRegLightbulb, FaBook, FaClipboardList, FaShippingFast } from 'react-icons/fa';

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        { id: 1, title: 'Khám phá Sách', description: 'Tìm kiếm và quản lý danh sách sách của bạn.', route: '/books', icon: <FaBook size={30} color="#1890ff" /> },
        { id: 2, title: 'Quản lý Đơn Hàng', description: 'Theo dõi đơn hàng mọi lúc mọi nơi.', route: '/orders', icon: <FaClipboardList size={30} color="#faad14" /> },
    ];

    return (
        <div className="home-page">
            <section className="promo-section">
                <div className="promo-container">
                    <div className="promo-main">
                        <FaShippingFast size={150} className="promo-icon" />
                        <div className="promo-content">
                            <h1>PJNS</h1>
                            <p>Chào mừng bạn đến với PJNS - Nền tảng quản lý sách và đơn hàng hiệu quả, tiện lợi.</p>
                            <ul>
                                <li><FaBook color="#00d8ff" /> Khám phá và quản lý sách.</li>
                                <li><FaClipboardList color="#faad14" /> Theo dõi đơn hàng dễ dàng.</li>
                                <li><FaRegLightbulb color="#ff9800" /> Các tính năng được cập nhật thường xuyên.</li>
                            </ul>
                            <button onClick={() => navigate('/about')}>Tìm hiểu về chúng tôi</button>
                        </div>
                    </div>

                    <div className="promo-side">
                        <div className="promo-card">
                            <FaRegLightbulb size={30} color="#00bcd4" />
                            <h3 style={{ marginBottom: "1rem" }}>Thay đổi gần đây</h3>
                            <div>
                                {features.map((feature) => (
                                    <div key={feature.id} style={{ marginBottom: "1rem", border: "1px solid #16141414" }} className={`feature-item ${feature.id % 2 === 0 ? 'even' : 'odd'}`} onClick={() => navigate(feature.route)}>
                                        {feature.icon}
                                        <div>
                                            <h4>{feature.title}</h4>
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
