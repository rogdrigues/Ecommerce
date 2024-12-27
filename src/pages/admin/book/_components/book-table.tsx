import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Form, Tooltip, DatePicker } from 'antd';
import type { ColumnType, TablePaginationConfig } from 'antd/es/table';
import columns from '@/pages/admin/book/_components/book-table-columns-config.tsx';
import { getBooksAPI } from '@/services';
import { CloudDownloadOutlined, PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import BookActions from '@/pages/admin/book/_components/book-table-row-actions.tsx';
import BookModal from './book-form-modal';
import { CSVLink } from 'react-csv';

const { RangePicker } = DatePicker;

interface SearchFilters {
    mainText: string;
    author: string;
    dateRange: [string, string] | [];
}

const initialSearchFilters: SearchFilters = {
    mainText: '',
    author: '',
    dateRange: [],
};

const TableBook = () => {
    const [data, setData] = useState<IBookTable[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['1', '2', '5', '10', '20', '50'],
    });
    const [loading, setLoading] = useState(false);
    const [searchFilters, setSearchFilters] = useState(initialSearchFilters);
    const [modals, setModals] = useState({
        addNewBook: false,
    });

    const toggleModal = (modal: keyof typeof modals, visible: boolean) => {
        setModals((prev) => ({
            ...prev,
            [modal]: visible,
        }));
    };

    useEffect(() => {
        fetchData(pagination.current || 1, pagination.pageSize || 10);
    }, []);

    const fetchData = async (current: number, pageSize: number, query?: Record<string, unknown>) => {
        setLoading(true);
        try {
            const res = await getBooksAPI(current, pageSize, query);

            setData(res.data?.result || []);
            setPagination({
                ...pagination,
                current: res.data?.meta.current,
                pageSize: res.data?.meta.pageSize,
                total: res.data?.meta.total,
            });
        } catch (error) {
            console.error('Error fetching book data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (
        newPagination: TablePaginationConfig,
    ) => {
        fetchData(newPagination.current!, newPagination.pageSize!);
        setPagination(newPagination);
    };

    const handleSearch = () => {
        const query: Record<string, unknown> = {};

        if (searchFilters.mainText) {
            query.mainText = { $regex: searchFilters.mainText, $options: 'i' };
        }

        if (searchFilters.author) {
            query.author = { $regex: searchFilters.author, $options: 'i' };
        }

        if (searchFilters.dateRange.length === 2) {
            query.createdAt = {
                $gte: searchFilters.dateRange[0],
                $lte: searchFilters.dateRange[1],
            };
        }

        fetchData(pagination.current!, pagination.pageSize!, query);
    };

    const handleReset = () => {
        setSearchFilters(initialSearchFilters);
        fetchData(1, pagination.pageSize!);
    };

    const handleReload = () => {
        fetchData(pagination.current!, pagination.pageSize!);
    };

    const handleExportBook = () => {
        //csv link handle
    };

    return (
        <>
            <section style={{ margin: '16px 0', padding: 16, background: '#fff', borderRadius: 8 }}>
                <Form layout="inline" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <Form.Item label="Name of Book" style={{ flex: 1, minWidth: '200px' }}>
                        <Input
                            placeholder="Enter book title"
                            value={searchFilters.mainText}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, mainText: e.target.value })
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Author" style={{ flex: 1, minWidth: '200px' }}>
                        <Input
                            placeholder="Enter author name"
                            value={searchFilters.author}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, author: e.target.value })
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Created At" style={{ flex: 1, minWidth: '200px' }}>
                        <RangePicker
                            format="YYYY-MM-DD"
                            value={
                                searchFilters.dateRange.length
                                    ? [
                                        dayjs(searchFilters.dateRange[0]),
                                        dayjs(searchFilters.dateRange[1]),
                                    ]
                                    : null
                            }
                            onChange={(dates, dateStrings) => {
                                setSearchFilters({
                                    ...searchFilters,
                                    dateRange: dateStrings,
                                });
                            }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginLeft: 'auto' }}>
                        <Space>
                            <Button onClick={handleReset}>Reset</Button>
                            <Button type="primary" onClick={handleSearch}>
                                Search
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </section>

            <section style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
                <div
                    style={{
                        marginBottom: 16,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h2 style={{ margin: 0 }}>Table Books</h2>

                    <Space>
                        <Button
                            type="default"
                            icon={<CloudDownloadOutlined />}
                        >
                            <CSVLink
                                data={data}
                                filename={`users-${dayjs().format('YYYY-MM-DD')}.csv`}>
                                Export
                            </CSVLink>

                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => toggleModal('addNewBook', true)}
                        >
                            Add new
                        </Button>
                        <Tooltip title="Reload">
                            <Button icon={<ReloadOutlined />} onClick={handleReload} />
                        </Tooltip>
                        <Tooltip title="Column settings">
                            <Button icon={<SettingOutlined />} />
                        </Tooltip>
                    </Space>
                </div>

                <Table
                    columns={columns.map((col) => {
                        if ((col as ColumnType<IBookTable>).key === 'actions') {
                            return {
                                ...col,
                                render: (_: unknown, record: IBookTable) => {
                                    if (!record) return null;

                                    return (
                                        <BookActions
                                            record={record}
                                            userRole="ADMIN"
                                            onReload={handleReload}
                                        />
                                    );
                                },
                            };
                        }
                        return col;
                    }) as ColumnType<IBookTable>[]}

                    dataSource={data}
                    pagination={{
                        ...pagination,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                    loading={loading}
                    rowKey="_id"
                    onChange={handleTableChange}
                    bordered
                />
            </section>

            <BookModal
                visible={modals.addNewBook}
                onClose={() => toggleModal('addNewBook', false)}
                reload={handleReload}
            />
        </>
    );
};

export default TableBook;
