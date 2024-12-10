import { useEffect, useMemo, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import guestRoutes from "./routes/guest-routes";
import userRoutes from "./routes/user-routes";
import { useAppContext } from "@/context/app.context";
import { fetchAccountAPI } from "@/services";
import { PropagateLoader } from "react-spinners";

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
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
        };
        fetchAccount();
    }, [setUser, setIsAuthenticated]);

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
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <PropagateLoader loading={isLoading} size={15} color="#32CD32" />
                <p style={{ marginTop: "30px", fontSize: "16px", color: "#32CD32" }}>
                    Đang tải, vui lòng chờ...
                </p>
            </div>
        );
    }


    return (
        <RouterProvider router={router} />
    );
};

export default AppRouter;
