import { useEffect, useState } from "react"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router"
import { useDispatch } from "react-redux"
import { getCurrentUser } from "./features/auth/authSlice"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VideoPlayer from "./pages/VideoPlayer"
import Profile from "./pages/Profile"
import LikedVideos from "./pages/LikedVideos"
import Subscriptions from "./pages/Subscriptions"
import Upload from "./pages/Upload"

// ============ Layout ============
function Layout({ toggleTheme, isDark }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white flex flex-col">
            <Navbar toggleTheme={toggleTheme} isDark={isDark} />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 flex flex-col overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

// ============ Auth Layout (no sidebar) ============
function AuthLayout({ isDark }) {
    return (
        <div className={isDark ? "dark" : ""}>
            <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
                <Outlet />
            </div>
        </div>
    )
}

// ============ App Root ============
function AppRoot() {
    const dispatch = useDispatch()

    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark" ||
            (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    })

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }, [isDark])

   useEffect(() => {
    const hasSession = localStorage.getItem("isLoggedIn") === "true"
    if (hasSession) {
        dispatch(getCurrentUser())
    }
}, [])

    const toggleTheme = () => setIsDark(prev => !prev)

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout toggleTheme={toggleTheme} isDark={isDark} />,
            children: [
                {
                    index: true,
                    element: <Home />
                },
                {
                    path: "video/:videoId",
                    element: <VideoPlayer />
                },
                {
                    path: "profile/:username",
                    element: <Profile />
                },
                {
                    path: "liked-videos",
                    element: (
                        <ProtectedRoute>
                            <LikedVideos />
                        </ProtectedRoute>
                    )
                },
                {
                    path: "subscriptions",
                    element: (
                        <ProtectedRoute>
                            <Subscriptions />
                        </ProtectedRoute>
                    )
                },
                {
                    path: "upload",
                    element: (
                        <ProtectedRoute>
                            <Upload />
                        </ProtectedRoute>
                    )
                },
            ]
        },
        {
            element: <AuthLayout isDark={isDark} />,
            children: [
                {
                    path: "/login",
                    element: <Login />
                },
                {
                    path: "/register",
                    element: <Register />
                },
            ]
        }
    ])

    return <RouterProvider router={router} />
}

export default AppRoot