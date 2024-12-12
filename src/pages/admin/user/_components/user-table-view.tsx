import React from 'react';
import { Drawer, Descriptions, Tag } from 'antd';

interface ViewUserProps {
    record: IUserTable;
    visible: boolean;
    onClose: () => void;
}

const ViewUser: React.FC<ViewUserProps> = ({ record, visible, onClose }) => {
    const roleColor = {
        admin: 'red',
        user: 'blue',
        manager: 'green',
    }[record.role.toLowerCase()] || 'default';

    const statusColor = record.isActive ? 'green' : 'red';

    return (
        <Drawer
            title="User Details"
            placement="right"
            width={800}
            onClose={onClose}
            open={visible}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="ID">{record._id}</Descriptions.Item>
                <Descriptions.Item label="Full Name">{record.fullName}</Descriptions.Item>

                <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
                <Descriptions.Item label="Phone">{record.phone}</Descriptions.Item>

                <Descriptions.Item label="Role" span={1}>
                    <Tag color={roleColor}>{record.role.toUpperCase()}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={1}>
                    <Tag color={statusColor}>{record.isActive ? 'ACTIVE' : 'INACTIVE'}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Created At">
                    {new Date(record.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                    {new Date(record.updatedAt).toLocaleString()}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default ViewUser;
