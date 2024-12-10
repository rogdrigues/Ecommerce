import ErrorComponent from '@/components/ErrorComponent';
import { useAppContext } from '@/context/app.context';
import { ReactNode } from 'react';

type IProps = {
    children: ReactNode;
};

const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated } = useAppContext();

    if (!isAuthenticated) {
        return <ErrorComponent error="You are not authorized to access this page." />;
    }

    return props.children;
};

export default ProtectedRoute;
