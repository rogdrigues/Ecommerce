import React, { useState } from 'react';
import { Avatar, Typography, Tabs, Space, Modal, Button } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

interface IProps {
    openProfile: boolean;
    setOpenProfile: (open: boolean) => void;
}

const UserProfile: React.FC<IProps> = ({ openProfile, setOpenProfile }) => {
    const user = {
        avatar: '', // Empty to demonstrate default icon
        fullName: 'Admin User',
        email: 'admin@gmail.com',
        phone: '0123456789',
        dateOfBirth: '1980-01-01',
        gender: 'Male',
    };

    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<string>("");

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
                    <Avatar size={100} src={user.avatar} icon={!user.avatar && <UserOutlined />} />
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
            <div style={{ marginTop: 20 }}>
                {Object.entries(user).map(([key, value], index) => (
                    key !== "avatar" && (
                        <div
                            key={key}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                                borderBottom: '1px solid #d9d9d9',
                                paddingBottom: '8px',
                                borderTop: index === 1 ? '1px solid #d9d9d9' : 'none',
                                paddingTop: index === 1 ? '8px' : '0',
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <Typography.Text>{key.charAt(0).toUpperCase() + key.slice(1)}</Typography.Text>
                                {isEditing === key ? (
                                    <input
                                        style={{
                                            border: 'none',
                                            borderBottom: '1px solid #d9d9d9',
                                            outline: 'none',
                                            fontSize: '14px',
                                            width: '100%',
                                            marginTop: '4px',
                                        }}
                                        defaultValue={tempValue || value}
                                        onChange={(e) => setTempValue(e.target.value)}
                                    />
                                ) : (
                                    <Typography.Text style={{ display: 'block', marginTop: '4px' }}>
                                        {value}
                                    </Typography.Text>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {isEditing === key ? (
                                    <>
                                        <Button
                                            type="text"
                                            icon={<CheckOutlined style={{ color: '#000' }} />}
                                            onClick={() => {
                                                user[key] = tempValue;
                                                setIsEditing(null);
                                                setTempValue("");
                                            }}
                                        />
                                        <Button
                                            type="text"
                                            icon={<CloseOutlined style={{ color: '#000' }} />}
                                            onClick={() => {
                                                setIsEditing(null);
                                                setTempValue("");
                                            }}
                                        />
                                    </>
                                ) : (
                                    <Button
                                        type="text"
                                        icon={<EditOutlined style={{ color: '#000' }} />}
                                        onClick={() => {
                                            setIsEditing(key);
                                            setTempValue(value);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )
                ))}
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
            visible={openProfile}
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
