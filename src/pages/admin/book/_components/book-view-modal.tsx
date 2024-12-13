import { Drawer, Descriptions, Typography, Divider, Image } from 'antd';

interface IProps {
    record: IBookTable;
    visible: boolean;
    onClose: () => void;
}

const ViewBook = (props: IProps) => {
    const { record, visible, onClose } = props;

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    return (
        <Drawer
            title={
                <Typography.Title level={5} style={{ margin: 0 }}>
                    {record.mainText}
                </Typography.Title>
            }
            placement="right"
            width={800}
            onClose={onClose}
            open={visible}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="ID">{record._id}</Descriptions.Item>
                <Descriptions.Item label="Author">{record.author}</Descriptions.Item>

                <Descriptions.Item label="Book Name" span={2}>
                    {record.mainText}
                </Descriptions.Item>

                <Descriptions.Item label="Quantity">{record.quantity}</Descriptions.Item>
                <Descriptions.Item label="Price">
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(record.price)}
                </Descriptions.Item>

                <Descriptions.Item label="Category" span={2}>
                    {record.category}
                </Descriptions.Item>

                <Descriptions.Item label="Created At">
                    {new Date(record.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                    {new Date(record.updatedAt).toLocaleString()}
                </Descriptions.Item>
            </Descriptions>

            <Divider>Pictures</Divider>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                <Image
                    width={150}
                    height={200}
                    src={`${backendURL}/images/book/${record?.thumbnail}`}
                    alt="Book Thumbnail"
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                />

                {record.slider?.map((url, index) => (
                    <Image
                        key={index}
                        width={150}
                        height={200}
                        src={`${backendURL}/images/book/${url}`}
                        alt={`Book Slider ${index + 1}`}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                ))}
            </div>
        </Drawer>
    );
};

export default ViewBook;
