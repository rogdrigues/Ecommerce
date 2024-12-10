import AboutPage from "@/pages/user/about";
import BookPage from "@/pages/user/book";
import HomePage from "@/pages/user/home";
import UserLayout from "router/layouts/user-layout";
import ProtectedRoute from "router/guard/protected-route";
import ErrorComponent from "@/components/ErrorComponent";

const userRoutes = [
    {
        path: "/",
        element:
            <ProtectedRoute>
                <UserLayout />
            </ProtectedRoute>,
        errorElement: <ErrorComponent error="You are not authorized to access this page." />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "/book",
                element: <BookPage />
            },
            {
                path: "/about",
                element: <AboutPage />
            }
        ]
    }
]

export default userRoutes;