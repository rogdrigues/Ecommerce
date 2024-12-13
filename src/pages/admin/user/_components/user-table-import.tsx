import { useState } from 'react';
import { Modal, Upload, Table, Button, message } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadProps } from 'antd/es/upload/interface';
import * as XLSX from 'xlsx';
import { useNotification } from '@/context/notification.context';
import { bulkImportExcelUserAPI } from '@/services';

interface IProps {
    visible: boolean;
    onClose: () => void;
    reload: () => void;
}

interface IUser {
    fullName: string;
    email: string;
    phone: string;
}

const ImportUser = (props: IProps) => {
    const { visible, onClose, reload } = props;
    const [data, setData] = useState<IUser[]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const notification = useNotification();

    const handleCustomRequest: UploadProps['customRequest'] = ({ onSuccess }) => {
        setTimeout(() => {
            if (onSuccess) {
                onSuccess('ok');
            }
        }, 1000);
    };

    const handleFileChange: UploadProps['beforeUpload'] = (file: RcFile) => {
        try {
            const isExcel =
                file.type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel';

            if (!isExcel) {
                message.error('Only Excel files are allowed!');
                return Upload.LIST_IGNORE;
            }

            if (file.size > 2 * 1024 * 1024) {
                message.error('File size must be less than 2MB!');
                return Upload.LIST_IGNORE;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    if (!data) {
                        throw new Error('File data is empty or cannot be read.');
                    }

                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    if (!sheetName) {
                        throw new Error('No sheets found in the Excel file.');
                    }

                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json<IUser>(sheet);
                    setData(jsonData);
                    setFileName(file.name);
                } catch (error) {
                    console.error('Error processing Excel file:', error);
                    message.error('An error occurred while processing the Excel file.');
                }
            };

            reader.readAsBinaryString(file);
            notification.success({
                message: 'File tải lên thành công',
                description: 'Data đã được load từ file thành công. Bạn có thể xem trước dữ liệu trước khi gửi.',
            });
            return false;
        } catch (error) {
            console.error('Error reading file:', error);
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Không thể đọc file',
            });
            return Upload.LIST_IGNORE;
        }
    };

    const handleSubmit = async () => {
        const dataSubmit = data.map((item) => ({
            ...item,
            password: import.meta.env.VITE_PASSWORD_DEFAULT,
        }));

        const res = await bulkImportExcelUserAPI(dataSubmit);
        if (res && res.data) {
            notification.success({
                message: 'Import thành công',
                description: 'Dữ liệu đã được import thành công',
            });
            onClose();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Không thể import dữ liệu',
            });
        }
        handleClear();
        reload();
        onClose();
    }


    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
    ];

    const handleClear = () => {
        setData([]);
        setFileName(null);
    };

    return (
        <Modal
            title="Import Users"
            open={visible}
            onCancel={onClose}
            footer={
                <Button
                    type="primary"
                    onClick={() => { handleSubmit() }}
                >
                    Import
                </Button>
            }
            centered
            width={800}
        >
            <div style={{ marginBottom: 16 }}>
                <Upload.Dragger
                    name="file"
                    accept=".xlsx,.xls"
                    beforeUpload={handleFileChange}
                    customRequest={handleCustomRequest}
                    multiple={false}
                    maxCount={1}
                    showUploadList={false}
                >
                    <p className="ant-upload-drag-icon">
                        <i className="anticon anticon-inbox" />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Only Excel files are accepted. Maximum 1 file at a time.
                    </p>
                    <a
                        href="/path-to-sample/sample-file.xlsx"
                        download="sample-file.xlsx"
                        style={{ display: 'block', marginTop: 16, color: '#1890ff' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        Download sample file
                    </a>
                </Upload.Dragger>

                {fileName && (
                    <div style={{ marginTop: 8 }}>
                        <strong>File Name:</strong> {fileName}{' '}
                        <Button
                            type="link"
                            onClick={handleClear}
                            style={{ padding: 0, color: '#ff4d4f' }}
                        >
                            Clear
                        </Button>
                    </div>
                )}
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="email"
                pagination={{ pageSize: 5 }}
                bordered
            />
        </Modal>
    );
};

export default ImportUser;
