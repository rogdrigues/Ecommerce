import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Form, Tooltip } from 'antd';
import type { ColumnType, TablePaginationConfig } from 'antd/es/table';
import columns from '@/pages/admin/order/_components/order-table-columns-config';
import { CloudDownloadOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import BookActions from '@/pages/admin/book/_components/book-table-row-actions.tsx';
import { getOrdersAPI } from '@/services/order.service';

interface SearchFilters {
    fullName: string;
    address: string;
}

const initialSearchFilters: SearchFilters = {
    fullName: '',
    address: '',
};

const TableOrder = () => {
    const [data, setData] = useState<IOrderHistory[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['1', '2', '5', '10', '20', '50'],
    });
    const [loading, setLoading] = useState(false);
    const [searchFilters, setSearchFilters] = useState(initialSearchFilters);

    useEffect(() => {
        fetchData(pagination.current || 1, pagination.pageSize || 10);
    }, []);

    const fetchData = async (current: number, pageSize: number, query?: Record<string, unknown>) => {
        setLoading(true);
        try {
            const res = await getOrdersAPI(current, pageSize, query);

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

        if (searchFilters.fullName) {
            query.fullName = { $regex: searchFilters.fullName, $options: 'i' };
        }

        if (searchFilters.address) {
            query.address = { $regex: searchFilters.address, $options: 'i' };
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

    return (
        <>
            <section style={{ margin: '16px 0', padding: 16, background: '#fff', borderRadius: 8 }}>
                <Form layout="inline" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <Form.Item label="Name of customer" style={{ flex: 1, minWidth: '200px' }}>
                        <Input
                            placeholder="Enter customer name"
                            value={searchFilters.fullName}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, fullName: e.target.value })
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Address" style={{ flex: 1, minWidth: '200px' }}>
                        <Input
                            placeholder="Enter address"
                            value={searchFilters.address}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, address: e.target.value })
                            }
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
                            onClick={() => { }}
                        >
                            Export
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
                    }) as ColumnType<IOrderHistory>[]}

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
        </>
    );
};

export default TableOrder;
