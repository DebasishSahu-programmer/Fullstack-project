import { useEffect } from "react"
import { Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { getSubscribedChannels, toggleSubscription } from "../features/subscription/subscriptionSlice"

export default function Subscriptions() {
    const dispatch = useDispatch()
    const { subscribedChannels, loading } = useSelector(state => state.subscription)
    const { user } = useSelector(state => state.auth)

    useEffect(() => {
        if (user?._id) dispatch(getSubscribedChannels(user._id))
    }, [user])

    const handleUnsubscribe = (channelId) => {
        dispatch(toggleSubscription(channelId))
    }

    return (
        <div className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>
                <div>
                    <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{subscribedChannels.length} channels</p>
                </div>
            </div>

            {/* Skeleton */}
            {loading && (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-100 dark:bg-dark-700 animate-pulse">
                            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-dark-600 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-1/3" />
                                <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Channels List */}
            {!loading && (
                subscribedChannels.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-dark-700 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No subscriptions yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Subscribe to channels to see them here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {subscribedChannels.map(({ channel }) => (
                            <div key={channel._id}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-dark-700 border border-gray-100 dark:border-dark-600 shadow-card hover:shadow-glow transition-all">
                                <Link to={`/profile/${channel.username}`}>
                                    <img
                                        src={channel.avatar || `https://ui-avatars.com/api/?name=${channel.username}`}
                                        alt={channel.username}
                                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-500/30"
                                    />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/profile/${channel.username}`}
                                        className="font-medium text-gray-900 dark:text-white hover:text-primary-500 transition-all block truncate">
                                        {channel.fullName}
                                    </Link>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">@{channel.username}</p>
                                </div>
                                <button onClick={() => handleUnsubscribe(channel._id)}
                                    className="px-4 py-1.5 text-sm font-medium rounded-xl bg-gray-100 dark:bg-dark-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all shrink-0">
                                    Unsubscribe
                                </button>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}