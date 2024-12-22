import { Modal, Button, Typography } from 'antd';
import { useNotification } from '@/context/notification.context';
import { deleteBookAPI } from '@/services';
import { useState } from 'react';

interface IProps {
    visible: boolean;
    onClose: () => void;
    record: IBookTable;
    onReload: () => void;
}

const DeleteBookModal = (props: IProps) => {
    const { visible, onClose, record, onReload } = props;
    const notification = useNotification();

    const [loading, setLoading] = useState(false);

    const onConfirm = async () => {
        setLoading(true);
        try {
            const res = await deleteBookAPI(record._id);

            if (res && res.data) {
                notification.success({
                    message: 'Xử lý thành công',
                    description: 'Sách đã được xóa thành công',
                });
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: 'Không thể xóa sách',
                });
            }
            onReload();
            onClose();
        } catch (error) {
            console.error('Error handling book:', error);
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Không thể xóa sách',
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
                Are you sure you want to delete the book{' '}
                <strong>{record.mainText || `with ID ${record._id}`}</strong>? This action cannot be undone.
            </Typography.Text>
        </Modal>
    );
};

export default DeleteBookModal;
