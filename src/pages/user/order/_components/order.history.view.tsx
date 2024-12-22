import { useState, useEffect } from "react";
import { Table, Typography, Button, Space, Tag, Form, Input, DatePicker } from "antd";
import { getOrderHistoryAPI } from "@/services/book.service";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [searchFilters, setSearchFilters] = useState({
        mainText: "",
        customer: "",
        dateRange: [],
    });

    useEffect(() => {
        fetchOrders(pagination.current, pagination.pageSize);
    }, []);

    const fetchOrders = async (current: number, pageSize: number, query?: Record<string, unknown>) => {
        setLoading(true);
        try {
            const response = await getOrderHistoryAPI();
            if (response?.data) {
                setOrders(response.data);
                setPagination({
                    current,
                    pageSize,
                    total: 0,
                });
            }
        } catch (error) {
            console.error("Error fetching order history:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination: any) => {
        fetchOrders(pagination.current, pagination.pageSize);
    };

    const handleSearch = () => {
        const query: Record<string, unknown> = {};

        if (searchFilters.mainText) {
            query.mainText = { $regex: searchFilters.mainText, $options: "i" };
        }

        if (searchFilters.customer) {
            query.customer = { $regex: searchFilters.customer, $options: "i" };
        }

        if (searchFilters.dateRange.length === 2) {
            query.createdAt = {
                $gte: searchFilters.dateRange[0],
                $lte: searchFilters.dateRange[1],
            };
        }

        fetchOrders(pagination.current, pagination.pageSize, query);
    };

    const handleReset = () => {
        setSearchFilters({ mainText: "", customer: "", dateRange: [] });
        fetchOrders(1, pagination.pageSize);
    };

    const handleReload = () => {
        fetchOrders(pagination.current, pagination.pageSize);
    };

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "_id",
            key: "_id",
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
        },
        {
            title: "Người nhận",
            dataIndex: "name",
            key: "name",
            render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (text: number) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(text),
        },
        {
            title: "Hình thức thanh toán",
            dataIndex: "type",
            key: "type",
            render: (type: string) => (
                <Tag color={type === "COD" ? "green" : "blue"}>{type === "COD" ? "Thanh toán khi nhận hàng" : "Chuyển khoản"}</Tag>
            ),
        },
        {
            title: "Ngày đặt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: Date) =>
                new Intl.DateTimeFormat("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }).format(new Date(date))
        },
        {
            title: "Trạng thái",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            render: (status: string) => {
                let color = "";
                switch (status) {
                    case "UNPAID":
                        color = "red";
                        break;
                    case "PAID":
                        color = "green";
                        break;
                    case "SHIPPING":
                        color = "blue";
                        break;
                    case "COMPLETED":
                        color = "green";
                        break;
                    case "CANCELLED":
                        color = "red";
                        break;
                    default:
                        color = "default";
                        break;
                }
                return <Tag color={color}>{status}</Tag>
            }
        },
    ];

    return (
        <div
            style={{
                padding: "20px",
                minHeight: "70vh",
            }}
        >
            <Title level={2} >
                Lịch sử đơn hàng
            </Title>

            <section
                style={{
                    margin: "16px 0",
                    padding: 16,
                    background: "#background: '#fff', borderRadius: 8",
                    borderRadius: 8,
                    marginBottom: "20px",
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Form layout="inline" style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    <Form.Item label="Mã đơn hàng" style={{ flex: 1, minWidth: "200px" }}>
                        <Input
                            placeholder="Nhập mã đơn hàng"
                            value={searchFilters.mainText}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, mainText: e.target.value })
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Khách hàng" style={{ flex: 1, minWidth: "200px" }}>
                        <Input
                            placeholder="Nhập tên người nhận"
                            value={searchFilters.customer}
                            onChange={(e) =>
                                setSearchFilters({ ...searchFilters, customer: e.target.value })
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Ngày đặt" style={{ flex: 1, minWidth: "200px" }}>
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

                    <Form.Item style={{ marginLeft: "auto" }}>
                        <Space>
                            <Button onClick={handleReset}>Reset</Button>
                            <Button type="primary" onClick={handleSearch}>
                                Search
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </section>

            <Table
                rowKey="_id"
                columns={columns}
                dataSource={orders}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showTotal: (total) => `Tổng cộng ${total} đơn hàng`,
                }}
                onChange={handleTableChange}
                style={{
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
            />
        </div>
    );
};

export default OrderHistoryPage;
