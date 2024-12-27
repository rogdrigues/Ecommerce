import { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Row, Col, Upload, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useNotification } from '@/context/notification.context';
import { addBookAPI, fileUploadAPI, getBookCategoryAPI, updateBookAPI } from '@/services';
import type { RcFile, UploadFile } from 'antd/es/upload';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

type UserUploadType = "thumbnail" | "slider";

interface IProps {
    visible: boolean;
    onClose: () => void;
    reload: () => void;
    bookData?: IBookTable;
}

const BookModal = (props: IProps) => {
    const { visible, onClose, reload, bookData } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const notification = useNotification();

    const [thumbnail, setThumbnail] = useState<UploadFile[]>([]);
    const [slider, setSlider] = useState<UploadFile[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await getBookCategoryAPI();
                setCategories(res.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        if (bookData) {
            form.setFieldsValue(bookData);
            console.log(bookData);
            setThumbnail(
                bookData.thumbnail
                    ? [
                        {
                            uid: uuidv4(),
                            name: bookData.thumbnail,
                            status: 'done',
                            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookData.thumbnail}`,
                        },
                    ]
                    : []
            );

            setSlider(
                bookData.slider?.map((url: string) => ({
                    uid: uuidv4(),
                    name: url,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${url}`,
                })) || []
            );
        } else {
            form.resetFields();
            setThumbnail([]);
            setSlider([]);
        }
    }, [bookData, form]);

    const validateFile = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJpgOrPng) {
            notification.error({
                message: 'Error',
                description: 'Only JPG/PNG files are accepted!',
            });
            return false;
        }

        if (!isLt2M) {
            notification.error({
                message: 'Error',
                description: 'Image must be smaller than 2MB!',
            });
            return false;
        }

        return true;
    };

    const beforeUpload = (file: RcFile) => validateFile(file) || Upload.LIST_IGNORE;

    const handleRemove = (file: UploadFile, type: "thumbnail" | "slider") => {
        if (type === "thumbnail") {
            setThumbnail([]);
        } else {
            setSlider((prevState) => prevState.filter((item) => item.uid !== file.uid));
        }
    };

    const handleUploadFile = async (
        options: RcCustomRequestOptions,
        type: UserUploadType
    ) => {
        try {
            const { onSuccess } = options;
            const file = options.file as UploadFile;
            const res = await fileUploadAPI(file, "book");

            if (res && res.data) {
                const uploadedFile: UploadFile = {
                    uid: file.uid,
                    name: res.data.fileUploaded,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
                }
                if (type === "thumbnail") {
                    setThumbnail([{ ...uploadedFile }])
                } else {
                    setSlider((prevState) => [...prevState, { ...uploadedFile }])
                }

                if (onSuccess) onSuccess('ok');
            } else {
                throw new Error(res.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            notification.error({
                message: 'Upload Failed',
                description: 'An error occurred during file upload. Please try again.',
            });
        }
    };

    const handleFinish = async (values: Omit<IBookTable, 'createdAt' | 'updatedAt'>) => {
        if (!thumbnail.length) {
            notification.error({
                message: 'Validation Error',
                description: 'Thumbnail is required!',
            });
            return;
        }

        if (!slider.length) {
            notification.error({
                message: 'Validation Error',
                description: 'At least one slider image is required!',
            });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...values,
                thumbnail: thumbnail[0].name,
                slider: slider.map((file) => file.name),
            };

            const res = bookData
                ? await updateBookAPI(bookData._id, payload)
                : await addBookAPI(payload);

            if (res && res.data) {
                notification.success({
                    message: 'Success',
                    description: bookData
                        ? 'Book has been successfully updated.'
                        : 'Book has been successfully added.',
                });
                reload();
                onClose();
            } else {
                throw new Error(res?.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Error handling book:', error);
            notification.error({
                message: 'Error',
                description: bookData
                    ? 'Failed to update the book.'
                    : 'Failed to add the book.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={bookData ? 'Update Book' : 'Add New Book'}
            open={visible}
            onCancel={() => {
                form.resetFields();
                setThumbnail([]);
                setSlider([]);
                onClose();
            }}
            footer={null}
            centered
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Book Title"
                            name="mainText"
                            rules={[{ required: true, message: 'Please enter the book title.' }]}
                        >
                            <Input placeholder="Enter book title" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Author"
                            name="author"
                            rules={[{ required: true, message: 'Please enter the author name.' }]}
                        >
                            <Input placeholder="Enter author name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Price (VND)"
                            name="price"
                            rules={[{ required: true, message: 'Please enter the price.' }]}
                        >
                            <InputNumber
                                placeholder="Enter price"
                                style={{ width: '100%' }}
                                min={1}
                                formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            rules={[{ required: true, message: 'Please enter the quantity.' }]}
                        >
                            <InputNumber placeholder="Enter quantity" style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: 'Please select a category.' }]}
                        >
                            <Select placeholder="Select a category">
                                {categories.map((category) => (
                                    <Select.Option key={category} value={category}>
                                        {category}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Thumbnail">
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                beforeUpload={beforeUpload}
                                onRemove={(file) => handleRemove(file, 'thumbnail')}
                                fileList={thumbnail}
                            >
                                {thumbnail.length === 0 && (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Slider">
                            <Upload
                                multiple
                                listType="picture-card"
                                customRequest={(options) => handleUploadFile(options, 'slider')}
                                beforeUpload={beforeUpload}
                                onRemove={(file) => handleRemove(file, 'slider')}
                                fileList={slider}
                            >
                                {slider.length < 10 && (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {bookData ? 'Update Book' : 'Add Book'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookModal;
