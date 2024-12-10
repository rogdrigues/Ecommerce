import { Button, Form, Input, Space, Divider } from 'antd';
import { useState } from 'react';
import 'styles/auth.scss';
import { registerAPI } from '@/services';
import { useNotification } from '@/context/notification.context';
import { useNavigate, Link } from 'react-router-dom';


const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
};

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
};

const RegisterPage = () => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const notificationAPI = useNotification();
    const navigate = useNavigate();

    const onFinish = async (values: FieldType) => {
        setIsSubmit(true);

        try {
            const response = await registerAPI(values);

            if (response && response.data) {
                notificationAPI.success({
                    message: 'Thành công',
                    description: 'Đăng ký thành công!',
                });
                setTimeout(() => {
                    setIsSubmit(false);
                    navigate('/login');
                }, 2000);
            } else {
                notificationAPI.error({
                    message: 'Có lỗi xảy ra',
                    description: response.message && Array.isArray(response.message) ? response.message[0] : response.message,
                });
            }
        } catch (err) {
            console.log(err);
            notificationAPI.error({
                message: 'Có lỗi xảy ra',
                description: 'Đăng ký không thành công!',
            });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <h1 className="auth-title">Đăng ký</h1>
                <Form
                    {...layout}
                    layout="vertical"
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    size="middle"
                >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Form.Item
                            name="fullName"
                            label="Họ tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Định dạng email không hợp lệ!' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, max: 32, message: 'Mật khẩu phải có từ 6-32 ký tự!' },
                                { whitespace: true, message: 'Mật khẩu không được chứa khoảng trắng!' },
                                {
                                    pattern: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{6,32}$'),
                                    message: 'Mật khẩu phải bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                { pattern: new RegExp('^(0|\\+84)\\d{9,10}$'), message: 'Số điện thoại không hợp lệ!' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                className="auth-button"
                                block
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={isSubmit}
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>

                <Divider orientation="center">OR</Divider>

                <div className="auth-footer">
                    Nếu đã có tài khoản, hãy{' '}
                    <Link to="/login">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
