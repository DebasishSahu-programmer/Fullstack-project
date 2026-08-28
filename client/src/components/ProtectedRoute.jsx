import { useSelector } from "react-redux"
import { Navigate } from "react-router"

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useSelector(state => state.auth)

    if (loading) return (
        <div className="flex-1 flex items-center justify-center min-h-screen">
            <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (!isAuthenticated) return <Navigate to="/login" replace />

    return children
}