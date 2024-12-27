import { useState, useEffect } from 'react';
import { Tabs, Pagination, Spin } from 'antd';
import BookFilterSidebar from './book.filter.sidebar';
import BookCard from './book.card';
import { getBooksAPI } from '@/services/book.service';
import 'styles/book.page.scss';

const { TabPane } = Tabs;

const BookPage = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 30,
        total: 0,
    });
    const [loading, setLoading] = useState(false);

    const fetchBooks = async (newPagination = pagination, query?: Record<string, unknown>) => {
        setLoading(true);
        try {
            const response = await getBooksAPI(newPagination.current, newPagination.pageSize, query);
            setTimeout(() => {
                setBooks(response.data?.result || []);
                setPagination({
                    ...newPagination,
                    total: response.data?.meta.total || 0,
                });
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching books:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const sortBooks = (criteria: string) => {
        let query = {};
        switch (criteria) {
            case 'default':
                query = { sort: '-sold' };
                break;
            case 'new':
                query = { sort: '-createdAt' };
                break;
            case 'low-to-high':
                query = { sort: 'price' };
                break;
            case 'high-to-low':
                query = { sort: '-price' };
                break;
            default:
                query = { sort: '-createdAt' };
        }
        fetchBooks({ ...pagination, current: 1 }, query);
    }
    const handlePageChange = (page: number, pageSize?: number) => {
        const newPagination = { ...pagination, current: page, pageSize: pageSize || pagination.pageSize };
        fetchBooks(newPagination);
    };

    const handleApplyFilter = (filters: { category?: string[]; price?: { $gte?: number; $lte?: number } }) => {
        const query: Record<string, string[] | { $gte?: number; $lte?: number }> = { ...filters };
        fetchBooks({ ...pagination, current: 1 }, query);
    };

    return (
        <div className="books-page">
            <BookFilterSidebar onApplyFilter={handleApplyFilter} />
            <div className="books-content">
                <div className="books-header">
                    <Tabs defaultActiveKey="default" onChange={(key) => sortBooks(key)}>
                        <TabPane tab="Phổ biến" key="default" />
                        <TabPane tab="Hàng Mới" key="new" />
                        <TabPane tab="Giá Thấp Đến Cao" key="low-to-high" />
                        <TabPane tab="Giá Cao Đến Thấp" key="high-to-low" />
                    </Tabs>
                    <p style={{ marginLeft: '20px' }}>{pagination.total} kết quả</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', margin: '50px 0' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        <div className="books-grid">
                            {books.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>

                        <Pagination
                            current={pagination.current}
                            total={pagination.total}
                            pageSize={pagination.pageSize}
                            onChange={handlePageChange}
                            style={{ justifyContent: 'center', marginTop: '20px' }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default BookPage;
