import { Button, Form, Input, Space, Divider } from 'antd';
import { useState } from 'react';
import 'styles/auth.scss';
import { loginAPI, loginGoogleAPI } from '@/services';
import { useNotification } from '@/context/notification.context';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/app.context';
import { GoogleOutlined } from '@ant-design/icons';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

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
    const { setIsAuthenticated, setUser } = useAppContext();

    const onFinish = async (values: FieldType) => {
        setIsSubmit(true);

        try {
            const response = await loginAPI(values.username, values.password);

            if (response && response.data) {
                const { user, access_token } = response.data;

                notificationAPI.success({
                    message: 'Thành công',
                    description: 'Đăng nhập thành công!',
                });

                setTimeout(() => {
                    setIsAuthenticated(true);
                    setUser(user);
                    localStorage.setItem('access_token', access_token);

                    navigate('/');
                }, 2000);
            } else {
                notificationAPI.error({
                    message: 'Có lỗi xảy ra',
                    description: response && response.message && Array.isArray(response.message) ? response.message[0] : response?.message,
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

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            const { data } = await axios(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${response.access_token}`,
                    },
                }
            )

            if (data && data.email) {
                const response = await loginGoogleAPI("GOOGLE", data.email);

                if (response && response.data) {
                    const { user, access_token } = response.data;

                    notificationAPI.success({
                        message: 'Thành công',
                        description: 'Đăng nhập thành công!',
                    });

                    setTimeout(() => {
                        setIsAuthenticated(true);
                        setUser(user);
                        localStorage.setItem('access_token', access_token);

                        navigate('/');
                    }, 2000);

                } else {
                    notificationAPI.error({
                        message: 'Có lỗi xảy ra',
                        description: response && response.message && Array.isArray(response.message) ? response.message[0] : response?.message,
                    });
                }
            }
        },
        onError: (error) => {
            console.log("Lỗi đăng nhập Google:", error);
        },
    });

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

                <Divider orientation="center">HOẶC</Divider>

                <Button
                    className="google-login-button"
                    block
                    type="default"
                    icon={<GoogleOutlined style={{ color: '#FFA500' }} />}
                    size="large"
                    onClick={() => handleGoogleLogin()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: '#4285F4',
                        color: '#4285F4',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        const btn = e.currentTarget;
                        btn.style.backgroundColor = '#4285F4';
                        btn.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        const btn = e.currentTarget;
                        btn.style.backgroundColor = '#fff';
                        btn.style.color = '#4285F4';
                    }}
                >
                    Đăng nhập bằng Google
                </Button>


                <div className="auth-footer">
                    Nếu chưa có tài khoản, hãy{' '}
                    <Link to="/register">Đăng ký</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
