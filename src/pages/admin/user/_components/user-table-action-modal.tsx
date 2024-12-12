import { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useNotification } from '@/context/notification.context';
import { addUserAPI } from '@/services';

interface IProps {
    visible: boolean;
    onClose: () => void;
    reload: () => void;
}

const AddNewUser = (props: IProps) => {
    const { visible, onClose, reload } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const notification = useNotification();

    const handleFinish = async (values: { fullName: string; email: string; phone: string; password: string }) => {
        setLoading(true);
        try {
            const res = await addUserAPI(values);
            if (res && res.data) {
                notification.success({
                    message: 'Xử lý thành công',
                    description: 'Người dùng đã được thêm thành công',
                });
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
            form.resetFields();
            reload();
            onClose();
        } catch (error) {
            console.error('Error adding user:', error);
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Không thể thêm người dùng',
            });
        } finally {
            setLoading(false);
        }
    };

    const onClosedModal = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Add New User"
            open={visible}
            onCancel={onClosedModal}
            footer={null}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please enter full name' }]}
                >
                    <Input placeholder="Enter full name" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Please enter a valid email' },
                    ]}
                >
                    <Input placeholder="Enter email" />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                        { required: true, message: 'Please enter phone number' },
                        { pattern: /^[0-9]+$/, message: 'Phone number must be numeric' },
                    ]}
                >
                    <Input placeholder="Enter phone" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please enter password' },
                        { min: 6, message: 'Password must be at least 6 characters' },
                    ]}
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Add User
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddNewUser;
