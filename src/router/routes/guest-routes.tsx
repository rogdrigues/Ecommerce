import { Navigate } from "react-router-dom";
import GuestLayout from "router/layouts/guest-layout";
import LoginPage from "pages/guest/login";
import RegisterPage from "pages/guest/register";

const guestRoutes = [
    {
        path: '/',
        element: <GuestLayout />,
        errorElement: <Navigate to="/login" replace />,
        children: [
            {
                path: '/',
                element: <Navigate to="/login" replace />,
            },
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/register',
                element: <RegisterPage />,
            }
        ],
    },
];

export default guestRoutes;