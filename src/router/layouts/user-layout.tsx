import AppHeader from "@/components/app.header"
import { Outlet } from "react-router-dom"

const UserLayout = () => {
    return (
        <>
            <AppHeader />
            <Outlet />
        </>
    )
}

export default UserLayout