import { Modal, Button, Typography } from 'antd';
import { useNotification } from '@/context/notification.context';
import { deleteUserAPI } from '@/services';
import { useState } from 'react';

interface IProps {
    visible: boolean;
    onClose: () => void;
    record: IUserTable;
    onReload: () => void;
}

const DeleteUserModal = (props: IProps) => {
    const { visible, onClose, record, onReload } = props;
    const notification = useNotification();

    const [loading, setLoading] = useState(false);

    const onConfirm = async () => {
        setLoading(true); // Bắt đầu xử lý
        try {
            const res = await deleteUserAPI(record._id);

            if (res && res.data) {
                notification.success({
                    message: 'Xử lý thành công',
                    description: 'Người dùng đã được xóa thành công',
                });
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: 'Không thể xóa người dùng',
                });
            }
            onReload();
            onClose();
        } catch (error) {
            console.error('Error handling user:', error);
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Không thể xóa người dùng',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!record) return null;

    return (
        <Modal
            title="Confirm Delete"
            open={visible}
            onCancel={onClose}
            centered
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="confirm" type="primary" danger onClick={onConfirm} loading={loading}>
                    Confirm
                </Button>,
            ]}
        >
            <Typography.Text>
                Are you sure you want to delete{' '}
                <strong>{record.fullName || `user with ID ${record._id}`}</strong>? This action cannot be undone.
            </Typography.Text>

        </Modal>
    );
};

export default DeleteUserModal;
