import React, { useState } from "react";
import { FaBook, FaTag, FaStar } from "react-icons/fa";
import { Typography } from "antd";
import "styles/book.page.scss";

const { Title, Text } = Typography;

const BookFilterSidebar = () => {
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceRange({ ...priceRange, [e.target.name]: e.target.value });
    };

    return (
        <div className="books-sidebar">
            <Title level={3}>Bộ lọc sản phẩm</Title>

            <div className="filter-section">
                <div className="filter-header">
                    <FaBook className="filter-icon" />
                    <Text strong>Danh mục sản phẩm</Text>
                </div>
                <label>
                    <input type="radio" name="category" />
                    <span className="custom-radio"></span>
                    <Text>Tiểu thuyết</Text>
                </label>
                <label>
                    <input type="radio" name="category" />
                    <span className="custom-radio"></span>
                    <Text>Sách giáo khoa</Text>
                </label>
                <label>
                    <input type="radio" name="category" />
                    <span className="custom-radio"></span>
                    <Text>Kỹ năng sống</Text>
                </label>
            </div>

            <div className="filter-section">
                <div className="filter-header">
                    <FaTag className="filter-icon" />
                    <Text strong>Khoảng giá</Text>
                </div>
                <div className="price-inputs">
                    <input
                        type="number"
                        placeholder="Min"
                        name="min"
                        value={priceRange.min}
                        onChange={handleInputChange}
                    />
                    <span>~</span>
                    <input
                        type="number"
                        placeholder="Max"
                        name="max"
                        value={priceRange.max}
                        onChange={handleInputChange}
                    />
                </div>
                <button
                    style={{
                        marginTop: "10px",
                        padding: "8px 10px",
                        backgroundColor: "#5a52e8",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        width: "100%",
                    }}
                    onClick={() => { }}
                >
                    Áp dụng
                </button>
            </div>

            <div className="filter-section">
                <div className="filter-header">
                    <FaTag className="filter-icon" />
                    <Text strong>Thể loại sách</Text>
                </div>
                <label>
                    <input type="checkbox" />
                    <span className="custom-checkbox"></span>
                    <Text>Văn học</Text>
                </label>
                <label>
                    <input type="checkbox" />
                    <span className="custom-checkbox"></span>
                    <Text>Khoa học</Text>
                </label>
                <label>
                    <input type="checkbox" />
                    <span className="custom-checkbox"></span>
                    <Text>Lịch sử</Text>
                </label>
            </div>

            <div className="filter-section">
                <div className="filter-header">
                    <FaStar className="filter-icon" />
                    <Text strong>Đánh giá</Text>
                </div>
                {[4, 3, 2, 1].map((rating) => (
                    <label key={rating}>
                        <input type="radio" name="rating" />
                        <div className="rating-stars">
                            {Array.from({ length: 5 }, (_, index) => (
                                <FaStar
                                    key={index}
                                    color={index < rating ? "#ffa500" : "#ccc"}
                                    className="star-icon"
                                />
                            ))}
                            <Text>& up</Text>
                        </div>
                    </label>
                ))}
            </div>

            <div className="clear-button">Xóa tất cả bộ lọc</div>
        </div>
    );
};

export default BookFilterSidebar;
