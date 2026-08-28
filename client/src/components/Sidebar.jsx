import { NavLink } from "react-router"
import { useSelector } from "react-redux"

const links = [
    {
        to: "/",
        label: "Home",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },
    {
        to: "/liked-videos",
        label: "Liked Videos",
        auth: true,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        )
    },
    {
        to: "/subscriptions",
        label: "Subscriptions",
        auth: true,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        )
    },
]

export default function Sidebar() {
    const { isAuthenticated, user } = useSelector(state => state.auth)

    return (
        <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-16 h-[calc(100vh-4rem)] py-6 px-3 border-r border-gray-100 dark:border-dark-600 overflow-y-auto">
            <nav className="flex flex-col gap-1">
                {links.map(link => {
                    if (link.auth && !isAuthenticated) return null
                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-gradient-main text-white shadow-glow"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white"
                                }`
                            }
                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    )
                })}
            </nav>

            {isAuthenticated && (
                <div className="mt-auto pt-6 flex flex-col gap-3">
                    <NavLink
                        to="/upload"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-main rounded-xl hover:opacity-90 shadow-glow transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Video
                    </NavLink>

                    <NavLink
                        to={`/profile/${user?.username}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-all"
                    >
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`}
                            alt={user?.username}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.fullName}</p>
                            <p className="text-xs text-gray-400 truncate">@{user?.username}</p>
                        </div>
                    </NavLink>
                </div>
            )}
        </aside>
    )
}