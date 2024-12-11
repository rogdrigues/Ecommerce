import { Space, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";

const columns: ColumnsType<IUserTable> = [
    {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
        width: 200,
        ellipsis: true,
        render: (id) => (
            <Tooltip title={`User ID: ${id}`}>
                <span>{id}</span>
            </Tooltip>
        ),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
        render: (email) => (
            <Tooltip title={`Email: ${email}`}>
                <span>{email}</span>
            </Tooltip>
        ),
    },
    {
        title: 'Full Name',
        dataIndex: 'fullName',
        key: 'fullName',
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        render: (name) => (
            <Tooltip title={`Full Name: ${name}`}>
                <span>{name}</span>
            </Tooltip>
        ),
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        sorter: (a, b) => a.phone.localeCompare(b.phone),
        render: (phone) => (
            <Tooltip title={`Phone: ${phone}`}>
                <span>{phone}</span>
            </Tooltip>
        ),
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        filters: [
            { text: 'Admin', value: 'admin' },
            { text: 'User', value: 'user' },
            { text: 'Manager', value: 'manager' },
        ],
        onFilter: (value, record) => record.role === value,
        render: (role) => (
            <Tooltip title={`Role: ${role}`}>
                <Tag color={role === 'admin' ? 'red' : role === 'manager' ? 'blue' : 'green'}>
                    {role.toUpperCase()}
                </Tag>
            </Tooltip>
        ),
    },
    {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        filters: [
            { text: 'Active', value: true },
            { text: 'Inactive', value: false },
        ],
        onFilter: (value, record) => record.isActive === value,
        render: (isActive) => (
            <Tag color={isActive ? 'green' : 'red'}>
                {isActive ? 'ACTIVE' : 'INACTIVE'}
            </Tag>
        ),
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        render: (date) => (
            <Tooltip title={`Created at: ${new Date(date).toLocaleString()}`}>
                <span>{new Date(date).toLocaleDateString()}</span>
            </Tooltip>
        ),
    },
    {
        title: 'Actions',
        key: 'actions',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render: (_, record) => (
            <Space size="middle">
                <Tooltip title="Edit this user">
                    <a>Edit</a>
                </Tooltip>
                <Tooltip title="View details">
                    <a target="_blank" rel="noopener noreferrer">View</a>
                </Tooltip>
            </Space>
        ),
    },
];

export default columns;
