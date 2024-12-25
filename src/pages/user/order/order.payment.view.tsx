import { Typography, Button, Steps, Skeleton } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ShoppingCartOutlined, CreditCardOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { updatePaymentOrderAPI } from "@/services/order.service";

const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const paymentRef = searchParams.get("vn_TxnRef") || "";
    const responseCode = searchParams.get("vnp_ResponseCode") || "";
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (paymentRef) {
            const paymentStatus = async () => {
                setLoading(true);
                try {
                    const status = responseCode === "00" ? "PAYMENT_SUCCED" : "PAYMENT_FAILED";
                    setIsSuccess(responseCode === "00");

                    const response = await updatePaymentOrderAPI(status, paymentRef);
                    if (response?.data) {
                        console.log("Update payment status successfully");
                    }
                } catch (error) {
                    console.error("Error updating payment status:", error);
                } finally {
                    setLoading(false);
                }
            };
            paymentStatus();
        }
    }, [paymentRef, responseCode]);

    const steps = [
        {
            title: "Đơn Hàng",
            icon: <ShoppingCartOutlined />,
            description: "Xem và chỉnh sửa danh sách sản phẩm.",
        },
        {
            title: "Thanh Toán",
            icon: <CreditCardOutlined />,
            description: "Chọn hình thức thanh toán.",
        },
        {
            title: isSuccess ? "Hoàn Thành" : "Thất Bại",
            icon: isSuccess ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
            description: isSuccess ? "Đơn hàng đã được thanh toán thành công." : "Thanh toán thất bại.",
        },
    ];

    if (loading) {
        return (
            <div style={{ maxWidth: "1400px", margin: "20px auto", padding: "20px" }}>
                <Skeleton active paragraph={{ rows: 6 }} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1400px", margin: "20px auto" }}>
            <Steps current={2}>
                {steps.map((step, index) => (
                    <Steps.Step key={index} title={step.title} icon={step.icon} description={step.description} />
                ))}
            </Steps>

            <div style={{ textAlign: "center", marginTop: "30px" }}>
                {isSuccess ? (
                    <>
                        <Typography.Title level={4} style={{ color: "#52c41a" }}>
                            <CheckCircleOutlined style={{ marginRight: "10px" }} />
                            Thanh toán thành công!
                        </Typography.Title>
                        <Typography.Paragraph>
                            Cảm ơn bạn đã thanh toán. Đơn hàng của bạn sẽ được xử lý trong thời gian sớm nhất.
                        </Typography.Paragraph>
                    </>
                ) : (
                    <>
                        <Typography.Title level={4} style={{ color: "#ff4d4f" }}>
                            <CloseCircleOutlined style={{ marginRight: "10px" }} />
                            Thanh toán thất bại!
                        </Typography.Title>
                        <Typography.Paragraph>
                            Rất tiếc, quá trình thanh toán của bạn đã không thành công. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.
                        </Typography.Paragraph>
                    </>
                )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "30px" }}>
                <Button
                    type="primary"
                    style={{
                        backgroundColor: isSuccess ? "#52c41a" : "#ff4d4f",
                        borderColor: isSuccess ? "#52c41a" : "#ff4d4f",
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
                    onClick={() => navigate("/order_view")}
                >
                    {isSuccess ? "Xem Lịch Sử Đặt Hàng" : "Thử Lại Thanh Toán"}
                </Button>
            </div>
        </div>
    );
};

export default PaymentPage;
