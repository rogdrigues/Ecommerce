import { Drawer, Descriptions, Tag, Typography, Avatar } from 'antd';

interface IProps {
    record: IUserTable;
    visible: boolean;
    onClose: () => void;
}

const ViewUser = (props: IProps) => {
    const { record, visible, onClose } = props;

    const roleColor = {
        admin: 'red',
        user: 'blue',
        manager: 'green',
    }[record.role.toLowerCase()] || 'default';

    const statusColor = record.isActive ? 'green' : 'red';

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Avatar size={48} src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${record?.avatar}`} alt={`${record.fullName}'s avatar`} />
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        {record.fullName}
                    </Typography.Title>
                </div>
            }
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
