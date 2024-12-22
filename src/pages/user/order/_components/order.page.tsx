import React, { useState } from "react";
import { useCart } from "@/context/cart.context";
import { Typography, Table, Button, InputNumber, Checkbox, Steps, Radio, Input, Space, Card, Form, Row, Col } from "antd";
import { DeleteOutlined, ShoppingCartOutlined, CreditCardOutlined, CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { createOrderAPI } from "@/services";
import { useNotification } from "@/context/notification.context";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>("COD");
    const notification = useNotification();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(cart.map((item) => item._id));
        } else {
            setSelectedItems([]);
        }
    };

    const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

    const selectedProducts = cart.filter((item) => selectedItems.includes(item._id));

    const totalAmount = selectedProducts.reduce(
        (sum, item) => sum + item.book.price * item.quantity,
        0
    );

    const handleSelectItem = (checked: boolean, _id: string) => {
        setSelectedItems((prev) =>
            checked ? [...prev, _id] : prev.filter((id) => id !== _id)
        );
    };

    const handlePlaceOrder = async () => {
        try {
            // Validate form before proceeding
            await form.validateFields();

            const orderData: IOrder = {
                name: form.getFieldValue("fullname"),
                address: form.getFieldValue("address"),
                phone: form.getFieldValue("phone"),
                totalPrice: totalAmount,
                type: paymentMethod,
                detail: selectedProducts.map((product) => ({
                    bookName: product.book.mainText,
                    quantity: product.quantity,
                    _id: product.book._id,
                })) as [{ bookName: string; quantity: number; _id: string }],
            };

            const response = await createOrderAPI(orderData);

            if (response?.statusCode === 201) {
                notification.success({
                    message: "Đặt hàng thành công",
                    description: "Đơn hàng của bạn đã được xử lý.",
                });
                setCurrentStep(2);
                //remove selected items from cart
                selectedItems.forEach((id) => removeFromCart(id));
            } else {
                throw new Error(response?.message || "Đặt hàng thất bại");
            }
        } catch (error: any) {
            console.error("Error placing order:", error);
            notification.error({
                message: "Lỗi",
                description: error.message || "Đã có lỗi xảy ra khi đặt hàng.",
            });
        }
    };

    const columns = [
        {
            title: (
                <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                >
                    Chọn tất cả
                </Checkbox>
            ),
            dataIndex: "checkbox",
            key: "checkbox",
            render: (text: string, record: any) => (
                <Checkbox
                    checked={selectedItems.includes(record._id)}
                    onChange={(e) =>
                        handleSelectItem(e.target.checked, record._id)
                    }
                />
            ),
        },
        {
            title: "Sản Phẩm",
            dataIndex: "product",
            key: "product",
            render: (text: string, record: any) => (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${record.book.thumbnail}`}
                        alt={record.book.mainText}
                        style={{
                            width: "50px",
                            height: "75px",
                            objectFit: "cover",
                            borderRadius: "4px",
                        }}
                    />
                    <Typography.Text>{record.book.mainText}</Typography.Text>
                </div>
            ),
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (text: number, record: any) => (
                <Typography.Text>
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(record.book.price)}
                </Typography.Text>
            ),
        },
        {
            title: "Số Lượng",
            dataIndex: "quantity",
            key: "quantity",
            render: (text: number, record: any) => (
                <InputNumber
                    min={1}
                    max={record.book.quantity}
                    value={record.quantity}
                    onChange={(value) =>
                        updateQuantity(record._id, value as number)
                    }
                />
            ),
        },
        {
            title: "Tổng",
            dataIndex: "total",
            key: "total",
            render: (text: number, record: any) => (
                <Typography.Text strong>
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(record.book.price * record.quantity)}
                </Typography.Text>
            ),
        },
        {
            title: "Thao Tác",
            key: "action",
            render: (text: string, record: any) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromCart(record._id)}
                >
                    Xóa
                </Button>
            ),
        },
    ];

    const steps = [
        {
            title: "Đơn Hàng",
            icon: <ShoppingCartOutlined />,
            description: "Xem và chỉnh sửa danh sách sản phẩm.",
            content: (
                <div
                    style={{
                        maxWidth: "1400px",
                        margin: "20px auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Table
                            dataSource={cart}
                            columns={columns}
                            pagination={false}
                            rowKey="_id"
                            style={{ marginTop: "20px" }}
                        />
                    </div>

                    <div
                        style={{
                            background: "#fff",
                            padding: "20px 30px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "20px",
                            }}
                        >
                            <Checkbox
                                checked={isAllSelected}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                style={{ fontSize: "16px" }}
                            >
                                Chọn tất cả ({cart.length})
                            </Checkbox>
                            <Button
                                type="primary"
                                danger
                                onClick={() => setSelectedItems([])}
                                style={{ fontSize: "16px" }}
                            >
                                Xóa sản phẩm được chọn
                            </Button>
                            <Typography.Text
                                style={{ fontSize: "14px" }}
                            >
                                Tổng thanh toán ({selectedItems.length} Sản phẩm):{" "}
                                <span style={{ fontWeight: "bold", fontSize: "20px", color: "#ff4d4f" }}>
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(totalAmount)}
                                </span>
                            </Typography.Text>
                            <Button
                                type="primary"
                                disabled={selectedItems.length === 0}
                                style={{
                                    backgroundColor: "#ff4d4f",
                                    borderColor: "#ff4d4f",
                                    padding: "10px 30px",
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                }}
                                onClick={() => setCurrentStep(1)}
                            >
                                Tiếp Tục
                            </Button>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Thanh Toán",
            icon: <CreditCardOutlined />,
            description: "Chọn hình thức thanh toán.",
            content: (
                <Card style={{ maxWidth: "800px", margin: "20px auto", padding: "20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}>
                    <Typography.Title level={4}>Hình thức thanh toán</Typography.Title>
                    <Radio.Group
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        value={paymentMethod}
                        style={{ marginBottom: "20px" }}
                    >
                        <Space direction="vertical">
                            <Radio value="COD">Thanh toán khi nhận hàng</Radio>
                            <Radio value="BANK">Chuyển khoản ngân hàng</Radio>
                        </Space>
                    </Radio.Group>

                    {paymentMethod === "COD" && (
                        <>
                            <Table
                                dataSource={selectedProducts}
                                columns={columns.filter(col => col.key !== 'checkbox' && col.key !== 'action' && col.key !== 'quantity')}
                                pagination={false}
                                rowKey="_id"
                                style={{ marginBottom: "20px", width: "100%" }}
                            />
                            <Form layout="vertical" form={form}>
                                <Form.Item label="Họ và tên" name="fullname" required>
                                    <Input placeholder="Nhập họ và tên" style={{ marginBottom: "10px" }} />
                                </Form.Item>
                                <Form.Item label="Số điện thoại" name="phone" required>
                                    <Input placeholder="Nhập số điện thoại" style={{ marginBottom: "10px" }} />
                                </Form.Item>
                                <Form.Item label="Địa chỉ nhận hàng" name="address" required>
                                    <Input.TextArea placeholder="Nhập địa chỉ nhận hàng" rows={3} style={{ marginBottom: "10px" }} />
                                </Form.Item>
                                <Row gutter={16} style={{ marginTop: "20px" }}>
                                    <Col span={12}>
                                        <Typography.Text>Tạm tính:</Typography.Text>
                                    </Col>
                                    <Col span={12} style={{ textAlign: "right" }}>
                                        <Typography.Text style={{ fontSize: "16px" }}>
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(totalAmount)}
                                        </Typography.Text>
                                    </Col>
                                    <Col span={12}>
                                        <Typography.Text>Tổng cộng:</Typography.Text>
                                    </Col>
                                    <Col span={12} style={{ textAlign: "right" }}>
                                        <Typography.Text style={{ fontSize: "20px", color: "#ff7a45" }}>
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(totalAmount)}
                                        </Typography.Text>
                                    </Col>
                                </Row>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                                    <Button
                                        type="default"
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                        icon={<ArrowLeftOutlined />}
                                        onClick={() => setCurrentStep(0)}
                                    >
                                        Quay Lại
                                    </Button>
                                    <Button
                                        type="primary"
                                        disabled={selectedItems.length === 0}
                                        style={{
                                            backgroundColor: "#ff7a45",
                                            borderColor: "#ff7a45",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                        }}
                                        onClick={() => {
                                            handlePlaceOrder();
                                            setCurrentStep(2);
                                        }}
                                    >
                                        Đặt Hàng ({selectedItems.length})
                                    </Button>
                                </div>
                            </Form>
                        </>
                    )}
                </Card>
            ),
        },
        {
            title: "Hoàn Thành",
            icon: <CheckCircleOutlined />,
            description: "Đơn hàng đã được thanh toán thành công.",
            content: (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography.Title level={4} style={{ color: "#52c41a" }}>Thanh toán thành công!</Typography.Title>
                    <Typography.Paragraph>
                        Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn sẽ sớm được xử lý.
                    </Typography.Paragraph>
                    <Table
                        dataSource={selectedProducts}
                        columns={columns.filter(col => col.key !== 'checkbox' && col.key !== 'action' && col.key !== 'quantity')}
                        pagination={false}
                        rowKey="_id"
                        style={{ marginBottom: "20px", width: "100%" }}
                    />
                    <Row gutter={16} style={{ width: "100%" }}>
                        <Col span={12}>
                            <Typography.Text>Tạm tính:</Typography.Text>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <Typography.Text style={{ fontSize: "16px" }}>
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(totalAmount)}
                            </Typography.Text>
                        </Col>
                        <Col span={12}>
                            <Typography.Text>Tổng cộng:</Typography.Text>
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            <Typography.Text style={{ fontSize: "20px", color: "#ff7a45" }}>
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(totalAmount)}
                            </Typography.Text>
                        </Col>
                    </Row>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "20px" }}>
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: "#52c41a",
                                borderColor: "#52c41a",
                                fontSize: "16px",
                                fontWeight: "bold",
                            }}
                            onClick={() => navigate("/")}
                        >
                            Quay Lại Trang Chủ
                        </Button>
                        <Button
                            type="default"
                            style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                            }}
                            onClick={() => alert("Đi đến lịch sử đặt hàng")}
                        >
                            Xem Lịch Sử Đặt Hàng
                        </Button>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: "1400px", margin: "20px auto" }}>
            <Steps current={currentStep}>
                {steps.map((step, index) => (
                    <Steps.Step key={index} title={step.title} icon={step.icon} description={step.description} />
                ))}
            </Steps>
            <div style={{ marginTop: "20px" }}>
                {steps[currentStep].content}
            </div>
        </div>
    );
}

export default OrderPage;