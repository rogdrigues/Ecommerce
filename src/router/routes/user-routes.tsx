import AboutPage from "@/pages/user/about";
import HomePage from "@/pages/user/home";
import UserLayout from "router/layouts/user-layout";
import ProtectedRoute from "router/guard/protected-route";
import ErrorComponent from "@/components/ErrorComponent";
import RoleBasedRoute from "router/guard/role-based-route";
import AdminLayout from "router/layouts/admin-layout";
import ManageOrderPage from "@/pages/admin/order";
import ManageBookPage from "@/pages/admin/book";
import ManageUserPage from "@/pages/admin/user";
import Dashboard from "@/pages/admin/dashboard";
import BookUserPage from "@/pages/user/book";
import BookDetail from "@/pages/user/book/_components/book.detail";
import OrderHistoryPage from "@/pages/user/order/order.history.view";
import OrderPage from "@/pages/user/order/order.page";
import PaymentPage from "@/pages/user/order/order.payment.view";

const routes = [
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <UserLayout />
            </ProtectedRoute>
        ),
        errorElement: <ErrorComponent error="You are not authorized to access this page." />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "book",
                element: <BookUserPage />
            },
            {
                path: "book/:id",
                element: <BookDetail />
            },
            {
                path: "order",
                element: <OrderPage />
            },
            {
                path: "order_view",
                element: <OrderHistoryPage />
            },
            {
                path: "vnpay/return-url",
                element: <PaymentPage />
            },
            {
                path: "about",
                element: <AboutPage />
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <RoleBasedRoute requiredRoles={["admin"]}>
                    <AdminLayout />
                </RoleBasedRoute>
            </ProtectedRoute>
        ),
        errorElement: <ErrorComponent error="Some error occurred." />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "book",
                element: <ManageBookPage />
            },
            {
                path: "order",
                element: <ManageOrderPage />
            },
            {
                path: "user",
                element: <ManageUserPage />
            },
            {
                path: "*",
                element: <ErrorComponent error="Error 404: Page not found." />
            }
        ]
    }
];

export default routes;
