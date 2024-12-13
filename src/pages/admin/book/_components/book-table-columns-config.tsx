import { Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

const columns: ColumnsType<IBookTable> = [
    {
        title: 'Name',
        dataIndex: 'mainText',
        key: 'mainText',
        sorter: (a, b) => a.mainText.localeCompare(b.mainText),
        render: (text) => (
            <Tooltip title={`Description: ${text}`}>
                <span>{text}</span>
            </Tooltip>
        ),
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        sorter: (a, b) => a.category.localeCompare(b.category),
        render: (category) => (
            <Tooltip title={`Category: ${category}`}>
                <Tag color="blue">{category}</Tag>
            </Tooltip>
        ),
    },
    {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
        sorter: (a, b) => a.author.localeCompare(b.author),
        render: (author) => (
            <Tooltip title={`Author: ${author}`}>
                <span>{author}</span>
            </Tooltip>
        ),
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        sorter: (a, b) => a.price - b.price,
        render: (price) => (
            <Tooltip title={`Price: ${formatCurrency(price)}`}>
                <span>{formatCurrency(price)}</span>
            </Tooltip>
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
    },
];

export default columns;
