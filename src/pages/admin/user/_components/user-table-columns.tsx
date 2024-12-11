import { Space, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";

export interface GithubIssueItem {
    id: number;
    number: number;
    title: string;
    labels: { name: string; color: string }[];
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string | null;
};

const columns: ColumnsType<GithubIssueItem> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 150,
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        ellipsis: true,
        sorter: (a, b) => a.title.localeCompare(b.title),
        render: (text) => (
            <Tooltip title={`Title: ${text}`}>
                <a>{text}</a>
            </Tooltip>
        ),
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        sorter: (a, b) => a.state.localeCompare(b.state),
        filters: [
            { text: 'Open', value: 'open' },
            { text: 'Closed', value: 'closed' },
            { text: 'Processing', value: 'processing' },
        ],
        onFilter: (value, record) => record.state === value,
        render: (state) => {
            const color = state === 'open' ? 'red' : state === 'closed' ? 'green' : 'blue';
            return (
                <Tooltip title={`Current status: ${state}`}>
                    <Tag color={color}>{state.toUpperCase()}</Tag>
                </Tooltip>
            );
        },
    },
    {
        title: 'Labels',
        dataIndex: 'labels',
        key: 'labels',
        filters: [
            { text: 'Bug', value: 'bug' },
            { text: 'Feature', value: 'feature' },
            { text: 'Enhancement ', value: 'enhancement' },
        ],
        render: (_, record) => (
            <Space>
                {record.labels.map(({ name, color }) => (
                    <Tooltip title={`Label: ${name}`} key={name}>
                        <Tag color={color}>{name}</Tag>
                    </Tooltip>
                ))}
            </Space>
        ),
    },
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        render: (date) => (
            <Tooltip title={`Created at: ${date}`}>
                <span>{date}</span>
            </Tooltip>
        ),
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <Space size="middle">
                <Tooltip title="Edit this record">
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
