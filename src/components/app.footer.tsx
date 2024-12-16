import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import 'styles/app.footer.scss';

const AppFooter = () => {
    return (
        <footer className="app-footer">
            <div className="footer-container">
                <div className="footer-section about">
                    <h3 className="footer-title">Về PJNS</h3>
                    <p>Nền tảng quản lý sách và đơn hàng hiệu quả, tiện lợi, giúp bạn tiết kiệm thời gian và công sức.</p>
                </div>

                <div className="footer-section links">
                    <h3 className="footer-title">Liên kết nhanh</h3>
                    <ul>
                        <li><a href="/">Trang chủ</a></li>
                        <li><a href="/books">Sách</a></li>
                        <li><a href="/orders">Đơn hàng</a></li>
                        <li><a href="/about">Về chúng tôi</a></li>
                    </ul>
                </div>

                <div className="footer-section social">
                    <h3 className="footer-title">Theo dõi chúng tôi</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2024 PJNS</p>
            </div>
        </footer>
    );
};

export default AppFooter;