import { Space, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppContext } from '@/context/app.context';
import ViewUser from './user-table-view';
import { useState } from 'react';
import UserModal from './user-table-action-modal';

interface IProps {
    record: IUserTable;
    userRole?: string;
    onReload?: () => void;
}

const UserActions = (props: IProps) => {
    const { record, userRole, onReload } = props;
    const { user } = useAppContext();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);

    const canEditOrDelete = userRole === user?.role;

    return (
        <>
            <Space size="middle">
                {canEditOrDelete && (
                    <Tooltip title="Edit this user">
                        <EditOutlined
                            style={{ cursor: 'pointer', color: '#1890ff' }}
                            onClick={() => setUpdateModalVisible(true)}
                        />
                    </Tooltip>
                )}

                <Tooltip title="View details">
                    <EyeOutlined
                        style={{ cursor: 'pointer', color: '#52c41a' }}
                        onClick={() => setDrawerVisible(true)}
                    />
                </Tooltip>

                {canEditOrDelete && (
                    <Tooltip title="Delete this user">
                        <DeleteOutlined
                            style={{ cursor: 'pointer', color: '#ff4d4f' }}
                            onClick={() => console.log('Delete user:', record._id)}
                        />
                    </Tooltip>
                )}
            </Space>

            {/* For viewing user details */}
            <ViewUser
                record={record}
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
            />
            {/* For update user */}
            <UserModal
                visible={updateModalVisible}
                onClose={() => setUpdateModalVisible(false)}
                reload={onReload}
                userData={record}
            />
        </>
    );
};

export default UserActions;
