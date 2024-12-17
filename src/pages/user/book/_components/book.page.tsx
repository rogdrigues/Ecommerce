import { useState } from 'react';
import { Tabs, Pagination } from 'antd';
import BookFilterSidebar from './book.filter.sidebar';
import BookCard from './book.card';
import 'styles/book.page.scss';

const { TabPane } = Tabs;

const BookPage = () => {
    const [books, setBooks] = useState([
        { id: 1, title: 'Book 1', price: 200, rating: 4, image: '/images/book1.png' },
        { id: 2, title: 'Book 2', price: 150, rating: 5, image: '/images/book2.png' },
        { id: 3, title: 'Book 3', price: 300, rating: 3, image: '/images/book3.png' },
        { id: 4, title: 'Book 3', price: 300, rating: 3, image: '/images/book3.png' },
        { id: 5, title: 'Book 3', price: 300, rating: 3, image: '/images/book3.png' },
    ]);

    const [activeTab, setActiveTab] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 30;

    const sortBooks = (criteria: string) => {
        let sortedBooks = [...books];
        if (criteria === 'low-to-high') {
            sortedBooks.sort((a, b) => a.price - b.price);
        } else if (criteria === 'high-to-low') {
            sortedBooks.sort((a, b) => b.price - a.price);
        }
        setBooks(sortedBooks);
        setActiveTab(criteria);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * booksPerPage;
    const displayedBooks = books.slice(startIndex, startIndex + booksPerPage);

    return (
        <div className="books-page">
            <BookFilterSidebar />
            <div className="books-content">
                <div className="books-header">
                    <Tabs defaultActiveKey="default" onChange={(key) => setActiveTab(key)}>
                        <TabPane tab="Phổ biến" key="default" />
                        <TabPane tab="Hàng Mới" key="new" />
                        <TabPane tab="Giá Thấp Đến Cao" key="low-to-high" onClick={() => sortBooks('low-to-high')} />
                        <TabPane tab="Giá Cao Đến Thấp" key="high-to-low" onClick={() => sortBooks('high-to-low')} />
                    </Tabs>
                    <p style={{ marginLeft: '20px' }}>{books.length} kết quả</p>
                </div>

                <div className="books-grid">
                    {displayedBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>

                <Pagination
                    current={currentPage}
                    total={books.length}
                    pageSize={booksPerPage}
                    onChange={handlePageChange}
                    style={{ justifyContent: 'center', marginTop: '20px' }}
                />
            </div>
        </div>
    );
};

export default BookPage;
