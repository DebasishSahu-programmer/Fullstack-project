import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../features/auth/authSlice"

export default function Navbar({ toggleTheme, isDark }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, isAuthenticated } = useSelector(state => state.auth)
    const [search, setSearch] = useState("")
    const [menuOpen, setMenuOpen] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault()
        if (search.trim()) navigate(`/?query=${search}`)
    }

    const handleLogout = async () => {
        await dispatch(logoutUser())
        setMenuOpen(false)
        navigate("/login")
    }

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-dark-800/80 border-b border-gray-200 dark:border-dark-600">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 gap-4">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-main flex items-center justify-center shadow-glow">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <span className="font-display font-bold text-lg bg-linear-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                        VideoTube
                    </span>
                </Link>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:flex">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search videos..."
                            className="w-full px-4 py-2 pl-10 rounded-xl bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                        />
                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </form>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button onClick={toggleTheme}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all">
                        {isDark ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    {isAuthenticated ? (
                        <div className="relative">
                            <button onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`}
                                    alt={user?.username}
                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500"
                                />
                            </button>

                            {menuOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                                    {/* Menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-xl shadow-card border border-gray-100 dark:border-dark-500 overflow-hidden z-50">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-600">
                                            <p className="font-medium text-sm text-gray-900 dark:text-white">{user?.fullName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">@{user?.username}</p>
                                        </div>
                                        <Link to={`/profile/${user?.username}`} onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </Link>
                                        <Link to="/liked-videos" onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            Liked Videos
                                        </Link>
                                        <Link to="/upload" onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            Upload Video
                                        </Link>
                                        <button onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
                                Login
                            </Link>
                            <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-gradient-main rounded-xl hover:opacity-90 shadow-glow transition-all">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}