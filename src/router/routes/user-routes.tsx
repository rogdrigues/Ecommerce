import AboutPage from "@/pages/user/about";
import BookPage from "@/pages/user/book";
import HomePage from "@/pages/user/home";
import UserLayout from "router/layouts/user-layout";

const userRoutes = [
    {
        path: "/",
        element: <UserLayout />,
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