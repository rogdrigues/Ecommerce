import React from 'react';
import { Avatar, Typography, Tabs, Modal, Button, Form, Input } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, EditOutlined } from '@ant-design/icons';
import { useAppContext } from '@/context/app.context';
import { updateUserInfoAPI } from '@/services';
import { useNotification } from '@/context/notification.context';

interface IProps {
    openProfile: boolean;
    setOpenProfile: (open: boolean) => void;
}

const UserProfile: React.FC<IProps> = ({ openProfile, setOpenProfile }) => {
    const { user } = useAppContext();
    const notification = useNotification();
    const [form] = Form.useForm();

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                _id: user?.id || '',
                fullName: values.fullName || user?.fullName,
                phone: values.phone || user?.phone,
                avatar: user?.avatar || '',
            };
            const updatedUser = await updateUserInfoAPI(payload);
            if (updatedUser.data) {
                notification.success(
                    {
                        message: 'Success',
                        description: 'Profile updated successfully!',
                    }
                );
            }
        } catch {
            notification.error(
                {
                    message: 'Error',
                    description: 'Profile update failed!',
                }
            );
        }
    };

    const BasicInfo = () => (
        <>
            <Typography.Title level={4}>Basic Information</Typography.Title>
            <Typography.Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                Other users of your services may be able to see some of your information.
            </Typography.Text>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', position: 'relative' }}>
                <div style={{ flex: 1, marginRight: '16px' }}>
                    <Typography.Text strong>Profile Picture</Typography.Text>
                    <Typography.Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>
                        Your profile picture helps create a personal touch for your account.
                    </Typography.Text>
                </div>
                <div style={{ position: 'relative', width: 'fit-content' }}>
                    {user && (
                        <Avatar size={100} src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`} icon={!user.avatar && <UserOutlined />} />
                    )}
                    <Button
                        type="default"
                        shape="circle"
                        icon={<EditOutlined style={{ color: '#000' }} />}
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '0px',
                            transform: 'translate(0, 0)',
                            backgroundColor: '#fff',
                            border: '1px solid #d9d9d9',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff';
                        }}
                    />
                </div>
            </div>
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    fullName: user?.fullName,
                    phone: user?.phone,
                    email: user?.email,
                    role: user?.role,
                }}
                style={{ marginTop: '20px' }}
            >
                {['fullName', 'phone'].map((field) => (
                    <Form.Item
                        key={field}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        rules={[{ required: true, message: `${field} is required` }]}
                        style={{
                            marginBottom: '16px',
                            borderBottom: 'none',
                            paddingBottom: '8px',
                            position: 'relative',
                        }}
                    >
                        <Input />
                    </Form.Item>
                ))}
                <Form.Item
                    label="Email"
                    name="email"
                    style={{
                        marginBottom: '16px',
                        borderBottom: '1px solid #d9d9d9',
                        paddingBottom: '8px',
                    }}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Role"
                    name="role"
                    style={{
                        marginBottom: '16px',
                        borderBottom: '1px solid #d9d9d9',
                        paddingBottom: '8px',
                    }}
                >
                    <Input disabled />
                </Form.Item>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button type="primary" onClick={handleUpdate}>Save</Button>
            </div>
        </>
    );

    const PrivacySettings = () => (
        <Typography.Text>Privacy settings will go here.</Typography.Text>
    );

    const SecuritySettings = () => (
        <Typography.Text>Security settings will go here.</Typography.Text>
    );

    return (
        <Modal
            title="User Profile"
            open={openProfile}
            onCancel={() => setOpenProfile(false)}
            footer={null}
            width={1400}
        >
            <Tabs
                tabPosition="left"
                style={{ height: '100%' }}
                items={[{
                    key: 'basicInfo',
                    label: (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <UserOutlined />
                            My Account
                        </span>
                    ),
                    children: <BasicInfo />,
                },
                {
                    key: 'privacy',
                    label: (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <LockOutlined />
                            Privacy
                        </span>
                    ),
                    children: <PrivacySettings />,
                },
                {
                    key: 'security',
                    label: (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <SafetyOutlined />
                            Security
                        </span>
                    ),
                    children: <SecuritySettings />,
                }]}
            />
        </Modal>
    );
};

export default UserProfile;
