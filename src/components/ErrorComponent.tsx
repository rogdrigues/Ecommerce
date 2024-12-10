import { Button, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface ErrorComponentProps {
    error: string;
    reset?: () => void;
}

const ErrorComponent = (props: ErrorComponentProps) => {
    const { error, reset } = props;
    const navigate = useNavigate();

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
                backgroundColor: '#fff1f0',
                color: '#cf1322',
                padding: '20px',
            }}
        >
            <Title level={2} style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                Oops! Something went wrong.
            </Title>
            <Paragraph style={{ marginBottom: '24px' }}>
                {error || 'An unexpected error has occurred.'}
            </Paragraph>
            <Space>
                {reset && (
                    <Button type="primary" onClick={reset}>
                        Try Again
                    </Button>
                )}
                <Button type="default" onClick={() => navigate('/')}>
                    Go to Home
                </Button>
            </Space>
        </div>
    );
};

export default ErrorComponent;
