import { useAppContext } from "@/context/app.context";
import ErrorComponent from "@/components/ErrorComponent";

type IProps = {
    children: React.ReactNode;
    requiredRoles: string[];
};

const RoleBasedRoute = (props: IProps) => {
    const { user } = useAppContext();
    const { children, requiredRoles } = props;

    if (
        !user ||
        !requiredRoles.some(role => role.localeCompare(user.role, undefined, { sensitivity: 'accent' }) === 0)
    ) {
        return <ErrorComponent error="You are not authorized to access this page." />;
    }

    return children;
};

export default RoleBasedRoute;
