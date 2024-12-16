import AppFooter from "@/components/app.footer";
import AppHeader from "@/components/app.header"
import { Outlet } from "react-router-dom"

const UserLayout = () => {
    return (
        <>
            <AppHeader />
            <div style={{ margin: '75px 0' }}>
                <Outlet />
            </div>
            <AppFooter />
        </>
    );
};


export default UserLayout