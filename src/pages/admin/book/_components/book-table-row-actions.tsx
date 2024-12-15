import React, { memo, useEffect, useState } from 'react';
import { Space, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppContext } from '@/context/app.context';
import ViewBook from './book-view-modal';
import BookModal from './book-form-modal';
import DeleteBookModal from './book-delete-modal';

interface IProps {
    record: IBookTable;
    userRole?: string;
    onReload?: () => void;
}

const BookActions = memo((props: IProps) => {
    const { record, userRole, onReload = () => { } } = props;
    const { user } = useAppContext();
    const [activeModal, setActiveModal] = useState<'view' | 'update' | 'delete' | null>(null);
    const [currentRecord, setCurrentRecord] = useState<IBookTable | null>(null);

    const canEditOrDelete = userRole === user?.role;

    useEffect(() => {
        setCurrentRecord(record);
    }, [record]);

    const handleClear = () => {
        setActiveModal(null);
        setCurrentRecord(null);
    };

    return (
        <>
            <Space size="middle">
                {canEditOrDelete && (
                    <Tooltip title="Edit this book">
                        <EditOutlined
                            style={{ cursor: 'pointer', color: '#1890ff' }}
                            onClick={() => {
                                setActiveModal('update');
                                setCurrentRecord(record);
                            }}
                        />
                    </Tooltip>
                )}

                <Tooltip title="View details">
                    <EyeOutlined
                        style={{ cursor: 'pointer', color: '#52c41a' }}
                        onClick={() => {
                            setActiveModal('view');
                            setCurrentRecord(record);
                        }}
                    />
                </Tooltip>

                {canEditOrDelete && (
                    <Tooltip title="Delete this book">
                        <DeleteOutlined
                            style={{ cursor: 'pointer', color: '#ff4d4f' }}
                            onClick={() => {
                                setActiveModal('delete');
                                setCurrentRecord(record);
                            }}
                        />
                    </Tooltip>
                )}
            </Space>

            {currentRecord && activeModal === "view" && (
                <ViewBook
                    record={currentRecord}
                    visible={activeModal === 'view'}
                    onClose={handleClear}
                />
            )}

            {currentRecord && activeModal === "update" && (
                <BookModal
                    visible={activeModal === 'update'}
                    onClose={handleClear}
                    reload={onReload}
                    bookData={currentRecord}
                />
            )}

            {currentRecord && activeModal === "delete" && (
                <DeleteBookModal
                    visible={activeModal === 'delete'}
                    onClose={handleClear}
                    record={currentRecord}
                    onReload={onReload}
                />
            )}
        </>
    );
});

export default BookActions;
