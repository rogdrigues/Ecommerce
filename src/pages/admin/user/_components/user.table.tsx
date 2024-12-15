import { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Form, Tooltip, DatePicker } from 'antd';
import type { ColumnType, TablePaginationConfig } from 'antd/es/table';
import columns from '@/pages/admin/user/_components/user-table-columns-config.tsx';
import ImportUserModal from '@/pages/admin/user/_components/user-import-modal.tsx';
import { getUsersAPI } from '@/services';
import { CloudDownloadOutlined, ImportOutlined, PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { CSVLink } from 'react-csv';
import UserModal from '@/pages/admin/user/_components/user-form-modal.tsx';
import UserActions from './user-table-row-actions.tsx';

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
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['1', '2', '5', '10', '20', '50'],
    });
    const [loading, setLoading] = useState(false);
    const [searchFilters, setSearchFilters] = useState(initialSearchFilters);
    const [modals, setModals] = useState({
        addNewUser: false,
        importUser: false,
    });

    useEffect(() => {
        fetchData(pagination.current || 1, pagination.pageSize || 10);
    }, []);

    const fetchData = async (current: number, pageSize: number, query?: Record<string, unknown>) => {
        setLoading(true);
        try {
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
    ) => {
        fetchData(newPagination.current!, newPagination.pageSize!);
        setPagination(newPagination);
    };

    const handleSearch = () => {
        const query: Record<string, unknown> = {};

        if (searchFilters.fullName) {
            query.fullName = { $regex: searchFilters.fullName, $options: 'i' };
        }

        if (searchFilters.email) {
            query.email = { $regex: searchFilters.email, $options: 'i' };
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

        fetchData(pagination.current!, pagination.pageSize!, query);
    };

    const handleReset = () => {
        setSearchFilters(initialSearchFilters);
        fetchData(1, pagination.pageSize!);
    };

    const handleReload = () => {
        fetchData(pagination.current!, pagination.pageSize!);
    };

    const toggleModal = (modal: keyof typeof modals, visible: boolean) => {
        setModals((prev) => ({
            ...prev,
            [modal]: visible,
        }));
    };

    return (
        <>
            <section style={{ margin: '16px 0', padding: 16, background: '#fff', borderRadius: 8 }}>
                <Form layout="inline" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <Form.Item label="Full Name" style={{ flex: 1, minWidth: '200px' }}>
                        <Input
                            placeholder="Enter full name"
                            value={searchFilters.fullName}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, fullName: e.target.value })
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Email" style={{ flex: 1, minWidth: '200px' }}>
                        <Input
                            placeholder="Enter email"
                            value={searchFilters.email}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, email: e.target.value })
                            }
                        />
                    </Form.Item>

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
                    <h2 style={{ margin: 0 }}>Table user</h2>

                    <Space>
                        <Button
                            type="default"
                            icon={<CloudDownloadOutlined />}
                            onClick={() => { }}
                        >
                            <CSVLink
                                data={data}
                                filename={`users-${dayjs().format('YYYY-MM-DD')}.csv`}>
                                Export
                            </CSVLink>
                        </Button>
                        <Button
                            type="default"
                            icon={<ImportOutlined />}
                            onClick={() => toggleModal('importUser', true)}
                        >
                            Import
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => toggleModal('addNewUser', true)}
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

                        if ((col as ColumnType<IUserTable>).key === 'actions') {
                            return {
                                ...col,
                                render: (_: unknown, record: IUserTable) => (
                                    <UserActions
                                        record={record}
                                        userRole="ADMIN"
                                        onReload={handleReload}
                                    />
                                ),
                            };
                        }
                        return col;
                    }) as ColumnType<IUserTable>[]}
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

            <UserModal
                visible={modals.addNewUser}
                onClose={() => toggleModal('addNewUser', false)}
                reload={handleReload}
            />

            <ImportUserModal
                visible={modals.importUser}
                onClose={() => toggleModal('importUser', false)}
                reload={handleReload}
            />
        </>
    );
};

export default TableUser;
