import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Rate, InputNumber, Tag, Radio, Skeleton } from "antd";
import ImageGallery from "react-image-gallery";
import { getBookDetailsAPI } from "@/services/book.service";
import {
    MinusCircleOutlined,
    PlusCircleOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons";
import "react-image-gallery/styles/css/image-gallery.css";
import "styles/book.page.detail.scss";
import { useNotification } from "@/context/notification.context";
import { useCart } from "@/context/cart.context";


const useBookDetail = (id: string) => {
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [price, setPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setLoading(true);
                const response = await getBookDetailsAPI(id);
                setBook(response.data);
                if (response.data) {
                    setPrice(response.data.price);
                    setMaxPrice(response.data.price + 200000);
                }
            } catch (error) {
                console.error("Error fetching book details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [id]);

    const updatePrice = (type: string) => {
        setSelectedVersion(type);
        if (!book) return;
        switch (type) {
            case "standard":
                setPrice(book.price);
                break;
            case "signature":
                setPrice(book.price + 100000);
                break;
            case "special":
                setPrice(book.price + 200000);
                break;
            default:
                setPrice(book.price);
        }
    };

    return { book, loading, price, maxPrice, updatePrice, selectedVersion };
};


const BookDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { book, price, maxPrice, updatePrice, selectedVersion, loading } = useBookDetail(id!);
    const [quantity, setQuantity] = useState(1);
    const notification = useNotification();
    const { addToCart } = useCart();

    const images = book ? [
        {
            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${book.thumbnail}`,
            thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${book.thumbnail}`,
        },
        ...book.slider.map((image: string) => ({
            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${image}`,
            thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${image}`,
        })),
    ] : [];

    const handleQuantityChange = (type: string) => {
        if (type === 'increase') {
            if (quantity < book.quantity) {
                setQuantity(quantity + 1);
            }
        } else {
            if (quantity > 1) {
                setQuantity(quantity - 1);
            }
        }
    };

    const handleAddToCart = () => {
        if (!selectedVersion) {
            notification.warning({
                message: "Lưu ý",
                description: "Vui lòng chọn phiên bản trước khi thêm vào giỏ hàng",
            });
            return;
        }

        addToCart(book, quantity);
    };


    if (loading) {
        return (
            <div className="book-detail-container">
                <Skeleton active />
            </div>
        );
    }

    return (
        <div className="book-detail-container">
            <div className="book-detail">
                <div className="book-detail-image">
                    <ImageGallery
                        items={images}
                        showPlayButton={true}
                        showNav={true}
                        autoPlay={true}
                        slideInterval={5000}
                        showFullscreenButton={true}
                        showBullets={true}
                        renderLeftNav={(onClick, disabled) => (
                            <button
                                onClick={onClick}
                                disabled={disabled}
                                className="image-gallery-button left"
                            >
                                <LeftOutlined />
                            </button>
                        )}
                        renderRightNav={(onClick, disabled) => (
                            <button
                                onClick={onClick}
                                disabled={disabled}
                                className="image-gallery-button right"
                            >
                                <RightOutlined />
                            </button>
                        )}
                    />
                </div>

                <div className="book-detail-info">
                    <div className="book-detail-title">
                        <h1>{book.mainText}</h1>
                        <Tag className="tag">{book.category}</Tag>
                    </div>

                    <div className="book-meta-info">
                        <div className="rating">
                            <Rate disabled defaultValue={book.rating} />
                            <span>{`${book.reviews ?? 14} Đánh Giá`}</span>
                            <span>|</span>
                            <span>{`${book.sold.toLocaleString()} Đã Bán`}</span>
                        </div>
                    </div>

                    <div className="book-author">
                        <strong>Tác giả:</strong> {book.author}
                    </div>

                    <div className="book-version">
                        <strong>Phiên bản:</strong>
                        <Radio.Group
                            value={selectedVersion}
                            onChange={(e) => updatePrice(e.target.value)}
                        >
                            <Radio.Button value="standard">Bản thường</Radio.Button>
                            <Radio.Button value="signature">Bản chữ ký</Radio.Button>
                            <Radio.Button value="special">Bản đặc biệt</Radio.Button>
                        </Radio.Group>
                    </div>

                    <div className="book-price-wrapper">
                        <span className="price">
                            ₫{selectedVersion ? price?.toLocaleString() : `${book.price.toLocaleString()} - ₫${maxPrice?.toLocaleString()}`}
                        </span>
                    </div>

                    <div className="book-detail-quantity">
                        <span>Số lượng:</span>
                        <MinusCircleOutlined className="icon" onClick={() => handleQuantityChange('decrease')} />
                        <InputNumber min={1} max={book.quantity} value={quantity} defaultValue={1} readOnly controls={false} className="input-number" />
                        <PlusCircleOutlined className="icon" onClick={() => handleQuantityChange('increase')} />
                        <span className="available">({book.quantity} sẵn có)</span>
                    </div>

                    <div className="book-detail-actions">
                        <Button className="ant-btn-primary" onClick={handleAddToCart} disabled={!selectedVersion}>
                            <ShoppingCartOutlined /> Thêm vào giỏ hàng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
