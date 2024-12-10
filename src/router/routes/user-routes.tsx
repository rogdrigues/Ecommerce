import AboutPage from "@/pages/user/about";
import BookPage from "@/pages/user/book";
import HomePage from "@/pages/user/home";
import UserLayout from "router/layouts/user-layout";
import ProtectedRoute from "router/guard/protected-route";

const userRoutes = [
    {
        path: "/",
        element:
            <ProtectedRoute>
                <UserLayout />
            </ProtectedRoute>,
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