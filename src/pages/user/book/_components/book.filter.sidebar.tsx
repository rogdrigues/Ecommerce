import React, { useEffect, useState } from "react";
import { FaBook, FaTag } from "react-icons/fa";
import { Typography } from "antd";
import "styles/book.page.scss";
import { getBookCategoryAPI } from "@/services";

const { Title, Text } = Typography;

interface IFilterProps {
    onApplyFilter: (filters: { category?: string[]; price?: { $gte?: number; $lte?: number } }) => void;
}

const BookFilterSidebar = ({ onApplyFilter }: IFilterProps) => {
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getBookCategoryAPI();
                setCategories(res.data || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceRange({ ...priceRange, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
        );
    };

    const handleApplyFilter = () => {
        const query: Record<string, any> = {};

        if (selectedCategories.length > 0) {
            query.category = selectedCategories.join(",");
        }

        if (priceRange.min) query["price>"] = Number(priceRange.min);
        if (priceRange.max) query["price<"] = Number(priceRange.max);

        onApplyFilter(query);
    };


    return (
        <div className="books-sidebar">
            <Title level={3}>Bộ lọc sản phẩm</Title>

            <div className="filter-section">
                <div className="filter-header">
                    <FaBook className="filter-icon" />
                    <Text strong>Danh mục sản phẩm</Text>
                </div>
                {categories.map((category) => (
                    <label key={category}>
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                        />
                        <span className="custom-checkbox"></span>
                        <Text>{category}</Text>
                    </label>
                ))}
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
                    onClick={handleApplyFilter}
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
};

export default BookFilterSidebar;
