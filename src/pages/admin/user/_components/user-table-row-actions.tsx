import { Space, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppContext } from '@/context/app.context';
import ViewUser from './user-view-modal';
import { useState } from 'react';
import UserModal from './user-form-modal';
import DeleteUserModal from './user-delete-modal';

interface IProps {
    record: IUserTable;
    userRole?: string;
    onReload?: () => void;
}

const UserActions = (props: IProps) => {
    const { record, userRole, onReload = () => { } } = props;
    const { user } = useAppContext();

    const [activeModal, setActiveModal] = useState<'view' | 'update' | 'delete' | null>(null);

    const canEditOrDelete = userRole === user?.role;

    return (
        <>
            <Space size="middle">
                {canEditOrDelete && (
                    <Tooltip title="Edit this user">
                        <EditOutlined
                            style={{ cursor: 'pointer', color: '#1890ff' }}
                            onClick={() => setActiveModal('update')}
                        />
                    </Tooltip>
                )}

                <Tooltip title="View details">
                    <EyeOutlined
                        style={{ cursor: 'pointer', color: '#52c41a' }}
                        onClick={() => setActiveModal('view')}
                    />
                </Tooltip>

                {canEditOrDelete && (
                    <Tooltip title="Delete this user">
                        <DeleteOutlined
                            style={{ cursor: 'pointer', color: '#ff4d4f' }}
                            onClick={() => setActiveModal('delete')}
                        />
                    </Tooltip>
                )}
            </Space>

            <ViewUser
                record={record}
                visible={activeModal === 'view'}
                onClose={() => setActiveModal(null)}
            />

            <UserModal
                visible={activeModal === 'update'}
                onClose={() => setActiveModal(null)}
                reload={onReload}
                userData={record}
            />

            <DeleteUserModal
                visible={activeModal === 'delete'}
                onClose={() => setActiveModal(null)}
                record={record}
                onReload={onReload}
            />
        </>
    );
};

export default UserActions;
