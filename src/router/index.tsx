import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import guestRoutes from "./routes/guest-routes";

const AppRouter = () => {
    const isAuthenticated = false;

    const router = useMemo(() => {
        return createBrowserRouter(isAuthenticated ? [...guestRoutes] : [...guestRoutes], {
            future: {
                v7_relativeSplatPath: true,
                v7_fetcherPersist: true,
                v7_normalizeFormMethod: true,
                v7_partialHydration: true,
                v7_skipActionErrorRevalidation: true,
            },
        });
    }, [isAuthenticated]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default AppRouter;