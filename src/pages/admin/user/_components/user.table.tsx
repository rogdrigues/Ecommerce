import { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Form, Tooltip, DatePicker } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import columns from './user-table-columns';
import { getUsersAPI } from '@/services/user.service';
import { CloudDownloadOutlined, ImportOutlined, PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AddNewUser from './user-table-action-modal';
//import type { FilterValue, SorterResult } from 'antd/es/table/interface';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface SearchFilters {
    fullName: string;
    email: string;
    isActive: boolean | undefined;
    dateRange: [string, string] | [];
}

const initialSearchFilters: SearchFilters = {
    fullName: '',
    email: '',
    isActive: undefined,
    dateRange: [],
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
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchData(pagination.current || 1, pagination.pageSize || 5);
    }, []);

    const fetchData = async (current: number, pageSize: number, query?: Record<string, unknown>) => {
        setLoading(true);
        try {
            console.log('Fetching data with query:', query);
            const res = await getUsersAPI(current, pageSize, query);

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
        //filters: Record<string, FilterValue | null>,
        //sorter: SorterResult<IUserTable> | SorterResult<IUserTable>[],
    ) => {
        fetchData(newPagination.current!, newPagination.pageSize!);
        setPagination(newPagination);
    };

    const handleSearch = () => {
        const query: Record<string, unknown> = {};

        if (searchFilters.fullName) {
            query.fullName = { $regex: searchFilters.fullName, $options: "i" };
        }

        if (searchFilters.email) {
            query.email = { $regex: searchFilters.email, $options: "i" };
        }

        if (searchFilters.isActive !== undefined) {
            query.isActive = searchFilters.isActive;
        }


        if (searchFilters.dateRange.length === 2) {
            query.createdAt = {
                $gte: searchFilters.dateRange[0],
                $lte: searchFilters.dateRange[1],
            };
        }

        console.log("Dynamic Query:", query);

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
                    {/* Full Name */}
                    <Form.Item label="Full Name" style={{ flex: 1, minWidth: '200px' }}>
                        <Input
                            placeholder="Enter full name"
                            value={searchFilters.fullName}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, fullName: e.target.value })
                            }
                        />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item label="Email" style={{ flex: 1, minWidth: '200px' }}>
                        <Input
                            placeholder="Enter email"
                            value={searchFilters.email}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, email: e.target.value })
                            }
                        />
                    </Form.Item>

                    {/* Status */}
                    <Form.Item label="Status" style={{ flex: 1, minWidth: '200px' }}>
                        <Select
                            placeholder="Select status"
                            value={searchFilters.isActive}
                            onChange={(value) =>
                                setSearchFilters({ ...searchFilters, isActive: value })
                            }
                        >
                            <Option value={true}>Active</Option>
                            <Option value={false}>Inactive</Option>
                        </Select>

                    </Form.Item>

                    {/* Date Range */}
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

                    {/* Buttons */}
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
                        <Button type="default" icon={<CloudDownloadOutlined />} onClick={() => { }}>
                            Export
                        </Button>
                        <Button type="default" icon={<ImportOutlined />} onClick={() => { }}>
                            Import
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
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

            <AddNewUser
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                reload={handleReload}
            />
        </>
    );
};

export default TableUser;
