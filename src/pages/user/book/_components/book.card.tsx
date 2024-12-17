import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";

interface IProps {
    book: {
        id: number;
        title: string;
        price: number;
        rating?: number;
        reviews?: number;
        sold?: number;
        image: string;
    };
}

const BookCard = (props: IProps) => {
    const { book } = props;
    return (
        <div className="book-card">
            <div className="book-image">
                <img src={book.image} alt={book.title} />
            </div>
            <div className="book-details">
                <h4 className="book-title">{book.title}</h4>
                <p className="book-price">Giá: {book.price} VND</p>
                <div className="book-meta">
                    <span className="book-rating">
                        ⭐ {book.rating} ({book.reviews} đánh giá)
                    </span>
                    <span className="book-sold">Đã bán: {book.sold}</span>
                </div>
                <div className="book-actions">
                    <button className="add-to-cart-btn">
                        <FaShoppingCart /> Thêm vào
                    </button>
                    <button className="view-details-btn">
                        <FaInfoCircle /> Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
