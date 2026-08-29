import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearError } from "../features/auth/authSlice"

export default function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, isAuthenticated } = useSelector(state => state.auth)
    const [form, setForm] = useState({ email: "", password: "" })

    useEffect(() => {
        if (isAuthenticated) navigate("/")
        return () => dispatch(clearError())
    }, [isAuthenticated])

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(loginUser(form))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 px-4">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card border border-gray-100 dark:border-dark-600 p-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-main flex items-center justify-center shadow-glow mb-3">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-gradient-main rounded-xl hover:opacity-90 shadow-glow transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : "Sign in"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium transition-all">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}