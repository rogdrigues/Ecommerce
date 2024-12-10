import { Button, Form, Input, Space, Divider } from 'antd';
import { useState } from 'react';
import 'styles/auth.scss';
import { loginAPI } from '@/services';
import { useNotification } from '@/context/notification.context';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
};

type FieldType = {
    username: string;
    password: string;
};

const LoginPage = () => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const notificationAPI = useNotification();
    const navigate = useNavigate();

    const onFinish = async (values: FieldType) => {
        setIsSubmit(true);

        try {
            const response = await loginAPI(values.username, values.password);

            if (response && response.data) {
                notificationAPI.success({
                    message: 'Thành công',
                    description: 'Đăng nhập thành công!',
                });
                setTimeout(() => {
                    navigate('/');
                }, 2000);

            } else {
                notificationAPI.error({
                    message: 'Có lỗi xảy ra',
                    description: response.message && Array.isArray(response.message) ? response.message[0] : response.message,
                });
            }
        } catch (err: unknown) {
            console.log(err);
            notificationAPI.error({
                message: 'Có lỗi xảy ra',
                description: 'Đăng nhập không thành công!',
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <h1 className="auth-title">Đăng nhập</h1>
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
                            name="username"
                            label="Tên đăng nhập"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password />
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
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>

                <Divider orientation="center">OR</Divider>

                <div className="auth-footer">
                    Nếu chưa có tài khoản, hãy{' '}
                    <Link to="/register">Đăng ký</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
