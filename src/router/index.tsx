import { useEffect, useMemo, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import guestRoutes from "./routes/guest-routes";
import userRoutes from "./routes/user-routes";
import { useAppContext } from "@/context/app.context";
import { fetchAccountAPI } from "@/services";

const AppRouter = () => {
    const { isAuthenticated, setUser, setIsAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await fetchAccountAPI();
                if (res && res.data) {
                    setUser(res.data.user);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.log("Error fetching account:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAccount();
    }, [setUser, setIsAuthenticated]);

    // Chỉ tạo router sau khi đã xác định được trạng thái
    const router = useMemo(() => {
        return createBrowserRouter(
            isAuthenticated ? [...userRoutes] : [...guestRoutes],
            {
                future: {
                    v7_relativeSplatPath: true,
                    v7_fetcherPersist: true,
                    v7_normalizeFormMethod: true,
                    v7_partialHydration: true,
                    v7_skipActionErrorRevalidation: true,
                },
            }
        );
    }, [isAuthenticated]);

    if (isLoading) {
        // Hiển thị màn hình loading, hoặc có thể là component spinner
        return <div>Loading...</div>;
    }

    return (
        <RouterProvider router={router} />
    );
};

export default AppRouter;
