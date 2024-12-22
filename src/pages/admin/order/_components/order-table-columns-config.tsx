import { Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";

const columns: ColumnsType<IOrderHistory> = [
    {
        title: "Mã đơn hàng",
        dataIndex: "_id",
        key: "_id",
        render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    },
    {
        title: "Khách hàng",
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

export default columns;
