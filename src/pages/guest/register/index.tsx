import { Button, Form, Input, Space, Divider, Typography } from 'antd';
import { useState } from 'react';

const { Link } = Typography;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
};

type FieldType = {
    name: string;
    email: string;
    password: string;
    phone: string;
};

const RegisterPage = () => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = (values: FieldType) => {
        console.log(values);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#ccc',
                height: '100vh',
                width: '100vw',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: 600,
                    background: '#fff',
                    padding: '24px 48px',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                }}
            >
                <h1
                    style={{
                        textAlign: 'left',
                        marginBottom: '48px',
                        fontSize: '36px',
                        fontWeight: 'bold',
                    }}
                >
                    Đăng ký
                </h1>
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
                            name="name"
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
                            <Button style={{ marginTop: '24px' }} block type="primary" htmlType="submit" size="large" loading={isSubmit}>
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>

                <Divider orientation="center">OR</Divider>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '16px' }}>
                    Nếu đã có tài khoản, hãy{' '}
                    <Link href="/login">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
