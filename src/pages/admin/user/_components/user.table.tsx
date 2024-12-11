import React, { useState } from 'react';
import { Table, Button, Input, Select, Space, Form, Tooltip } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { FAKE_DATA } from './data';
import columns, { GithubIssueItem } from './user-table-columns';
import { PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const initialSearchFilters = {
    title: '',
    status: undefined,
    dateRange: [],
};

const TableUser = () => {
    const [data, setData] = useState(FAKE_DATA);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 5,
    });
    const [loading, setLoading] = useState(false);
    const [searchFilters, setSearchFilters] = useState(initialSearchFilters);

    const handleTableChange = (
        newPagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<GithubIssueItem> | SorterResult<GithubIssueItem>[],
    ) => {
        setPagination(newPagination);
        fetchData({ pagination: newPagination });
    };

    const fetchData = async (params = {}) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
    };

    const handleSearch = () => {
        const filteredData = FAKE_DATA.filter((item) => {
            const isTitleMatch = searchFilters.title
                ? item.title.toLowerCase().includes(searchFilters.title.toLowerCase())
                : true;
            const isStatusMatch = searchFilters.status
                ? item.state === searchFilters.status
                : true;
            return isTitleMatch && isStatusMatch;
        });
        setData(filteredData);
    };

    const handleReset = () => {
        setSearchFilters(initialSearchFilters);
        setData(FAKE_DATA);
    };

    const handleReload = () => {
        fetchData();
    };

    return (
        <>
            <section style={{ margin: "16px 0", padding: 16, background: '#fff', borderRadius: 8 }}>
                <Form layout="inline">
                    <Form.Item label="Title">
                        <Input
                            placeholder="Enter title"
                            value={searchFilters.title}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, title: e.target.value })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Status">
                        <Select
                            placeholder="Select status"
                            value={searchFilters.status}
                            onChange={(value) =>
                                setSearchFilters({ ...searchFilters, status: value })
                            }
                            style={{ width: 150 }}
                        >
                            <Option value="open">Open</Option>
                            <Option value="closed">Closed</Option>
                            <Option value="processing">Processing</Option>
                        </Select>
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

                <Table<GithubIssueItem>
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        ...pagination,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    loading={loading}
                    rowKey="id"
                    onChange={handleTableChange}
                    bordered
                />
            </section>
        </>
    );
};

export default TableUser;
