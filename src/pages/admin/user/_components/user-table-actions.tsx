import { Space, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppContext } from '@/context/app.context';
import ViewUser from './user-table-view';
import { useState } from 'react';

interface IProps {
    record: IUserTable;
    userRole?: string;
}

const UserActions = (props: IProps) => {
    const { record, userRole } = props;
    const { user } = useAppContext();
    const [drawerVisible, setDrawerVisible] = useState(false);

    const canEditOrDelete = userRole === user?.role;

    return (
        <>
            <Space size="middle">
                {canEditOrDelete && (
                    <Tooltip title="Edit this user">
                        <EditOutlined
                            style={{ cursor: 'pointer', color: '#1890ff' }}
                            onClick={() => console.log('Edit user:', record._id)}
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

        </>
    );
};

export default UserActions;
