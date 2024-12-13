import { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Row, Col, Upload, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { useNotification } from '@/context/notification.context';
import { addBookAPI, getBookCategoryAPI, updateBookAPI } from '@/services';

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

            setThumbnail(
                bookData.thumbnail
                    ? [
                        {
                            uid: uuidv4(),
                            name: 'thumbnail',
                            status: 'done',
                            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookData.thumbnail}`,
                        },
                    ]
                    : []
            );

            setSlider(
                bookData.slider?.map((url) => ({
                    uid: uuidv4(),
                    name: `slider-${uuidv4()}`,
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

    const handleThumbnailChange = ({ fileList }: { fileList: UploadFile[] }) => {
        const updatedThumbnail = fileList.map((file) => ({
            ...file,
            uid: file.uid || uuidv4(),
            url: file.response?.url || file.url,
        }));
        setThumbnail(updatedThumbnail);
    };

    const handleSliderChange = ({ fileList }: { fileList: UploadFile[] }) => {
        const updatedSlider = fileList.map((file) => ({
            ...file,
            uid: file.uid || uuidv4(),
            url: file.response?.url || file.url,
        }));
        setSlider(updatedSlider);
    };

    const handleUploadFile: UploadProps['customRequest'] = async ({ file, onSuccess }) => {
        setTimeout(() => {
            if (onSuccess) {
                onSuccess('ok');
            }
        }, 1000);
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            notification.error({
                message: 'Error',
                description: 'Only JPG/PNG files are accepted!',
            });
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            notification.error({
                message: 'Error',
                description: 'Image must be smaller than 2MB!',
            });
        }
        return isJpgOrPng && isLt2M ? true : Upload.LIST_IGNORE;
    };

    const handleFinish = async (values: Omit<IBookTable, 'createdAt' | 'updatedAt'>) => {
        setLoading(true);
        try {
            const thumbnailUrl = thumbnail.length > 0 && thumbnail[0].response?.url
                ? thumbnail[0].response.url
                : thumbnail[0]?.url || '';

            const sliderUrls = slider
                .map((file) => (file.response?.url ? file.response.url : file.url))
                .filter((url): url is string => !!url);

            const payload = {
                ...values,
                thumbnail: thumbnailUrl,
                slider: sliderUrls,
            };

            let res;
            if (bookData && bookData._id) {
                res = await updateBookAPI(bookData._id, payload);
            } else {
                res = await addBookAPI(payload);
            }

            if (res && res.data) {
                notification.success({
                    message: 'Success',
                    description: bookData
                        ? 'Book has been successfully updated.'
                        : 'Book has been successfully added.',
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: res?.message || 'An error occurred while processing the request.',
                });
            }

            form.resetFields();
            reload();
            onClose();
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

    const onClosedModal = () => {
        form.resetFields();
        setThumbnail([]);
        setSlider([]);
        onClose();
    };

    return (
        <Modal
            title={bookData ? 'Update Book' : 'Add New Book'}
            open={visible}
            onCancel={onClosedModal}
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
                                customRequest={handleUploadFile}
                                beforeUpload={beforeUpload}
                                onChange={handleThumbnailChange}
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
                                customRequest={handleUploadFile}
                                beforeUpload={beforeUpload}
                                onChange={handleSliderChange}
                                fileList={slider}
                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
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
