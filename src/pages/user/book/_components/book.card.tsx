import { Image } from "antd";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface IBookCardProps {
    book: {
        _id: string;
        mainText: string;
        price: number;
        sold?: number;
        thumbnail: string;
        category?: string;
        quantity?: number;
    };
}

const BookCard = ({ book }: IBookCardProps) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    return (
        <div className="book-card">
            <div className="book-image">
                <Image
                    width={150}
                    height={200}
                    src={`${backendURL}/images/book/${book?.thumbnail}`}
                    alt={book.mainText}
                    style={{ objectFit: 'contain', borderRadius: '8px' }}
                    preview={false}
                />
            </div>
            <div className="book-details">
                <h4 className="book-title">{book.mainText}</h4>
                <p className="book-price">Giá: {book.price.toLocaleString()} VND</p>
                <div className="book-meta">
                    {book.category && (
                        <span className="book-tag">
                            <span className="tag">{book.category}</span>
                        </span>
                    )}
                    {book.quantity !== undefined && (
                        <span className="book-quantity">
                            Số lượng: {book.quantity}
                        </span>
                    )}
                </div>
                <div className="book-actions">
                    <button className="add-to-cart-btn">
                        <FaShoppingCart /> Thêm vào giỏ
                    </button>
                    <button className="view-details-btn" onClick={() => { navigate(`/book/${book._id}`) }}>
                        <FaInfoCircle /> Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
