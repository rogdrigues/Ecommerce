import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Form, Tooltip } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import columns from './user-table-columns';
import { getUsersAPI } from '@/services/user.service'; // Import service gọi API
import { PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const initialSearchFilters = {
    title: '',
    status: undefined,
    createdAt: '',
};

const TableUser = () => {
    const [data, setData] = useState<IUserTable[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: ['1', '2', '5', '10', '20', '50'],
    });
    const [loading, setLoading] = useState(false);
    const [searchFilters, setSearchFilters] = useState(initialSearchFilters);

    useEffect(() => {
        fetchData(pagination.current || 1, pagination.pageSize || 5);
    }, []);

    const fetchData = async (current: number, pageSize: number) => {
        setLoading(true);
        try {
            const res = await getUsersAPI(current, pageSize);

            console.log(res);

            setData(res.data?.result || []);
            setPagination({
                ...pagination,
                current: res.data?.meta.current,
                pageSize: res.data?.meta.pageSize,
                total: res.data?.meta.total,
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (
        newPagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<IUserTable> | SorterResult<IUserTable>[],
    ) => {
        fetchData(newPagination.current!, newPagination.pageSize!);
        setPagination(newPagination);
    };

    const handleSearch = () => {
        console.log(searchFilters);

        fetchData(pagination.current!, pagination.pageSize!);
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
            <section style={{ margin: "16px 0", padding: 16, background: '#fff', borderRadius: 8 }}>
                <Form layout="inline" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <Form.Item label="Title" style={{ flex: 1, minWidth: '200px' }}>
                        <Input
                            placeholder="Enter title"
                            value={searchFilters.title}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, title: e.target.value })
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Status" style={{ flex: 1, minWidth: '200px' }}>
                        <Select
                            placeholder="Select status"
                            value={searchFilters.status}
                            onChange={(value) =>
                                setSearchFilters({ ...searchFilters, status: value })
                            }
                        >
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Created At" style={{ flex: 1, minWidth: '200px' }}>
                        <Input
                            type="date"
                            placeholder="Select date"
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, createdAt: e.target.value })
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


            {/* Table */}
            <section style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
                {/* Toolbar */}
                <div
                    style={{
                        marginBottom: 16,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h2 style={{ margin: 0 }}>Table user</h2>

                    <Space>
                        <Tooltip title="Reload">
                            <Button icon={<ReloadOutlined />} onClick={handleReload} />
                        </Tooltip>
                        <Tooltip title="Column settings">
                            <Button icon={<SettingOutlined />} />
                        </Tooltip>
                        <Button type="primary" icon={<PlusOutlined />}>
                            Add new
                        </Button>
                    </Space>
                </div>

                <Table<IUserTable>
                    columns={columns}
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

export default TableUser;
