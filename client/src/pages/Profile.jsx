import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { getUserChannelProfile, updateUserAvatar, updateUserCoverImage } from "../features/auth/authSlice"
import { getAllVideos } from "../features/video/videoSlice"
import { toggleSubscription } from "../features/subscription/subscriptionSlice"
import VideoCard from "../components/VideoCard"

export default function Profile() {
    const { username } = useParams()
    const dispatch = useDispatch()
    const { channel, user } = useSelector(state => state.auth)
    const { videos, loading } = useSelector(state => state.video)
    const [subscribed, setSubscribed] = useState(false)

    const isOwner = user?.username === username

    useEffect(() => {
        dispatch(getUserChannelProfile(username))
        dispatch(getAllVideos({}))
    }, [username])

    useEffect(() => {
        if (channel) setSubscribed(channel.isSubscribed)
    }, [channel])

    const handleSubscribe = async () => {
        setSubscribed(!subscribed)
        await dispatch(toggleSubscription(channel._id))
    }

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        const formData = new FormData()
        formData.append("avatar", file)
        await dispatch(updateUserAvatar(formData))
    }

    const handleCoverChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        const formData = new FormData()
        formData.append("coverImage", file)
        await dispatch(updateUserCoverImage(formData))
    }

    const channelVideos = videos.filter(v => v.owner?.username === username)

    if (!channel) return (
        <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="flex-1 max-w-5xl mx-auto w-full">
            {/* Cover Image */}
            <div className="relative">
                <div className="h-40 md:h-56 w-full bg-gradient-hero overflow-hidden">
                    {channel.coverImage && (
                        <img src={channel.coverImage} alt="cover" className="w-full h-full object-cover" />
                    )}
                    {isOwner && (
                        <label className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-xl cursor-pointer transition-all">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                        </label>
                    )}
                </div>

                {/* Avatar */}
                <div className="absolute -bottom-12 left-6">
                    <div className="relative">
                        <img
                            src={channel.avatar || `https://ui-avatars.com/api/?name=${channel.username}`}
                            alt={channel.username}
                            className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-dark-800 shadow-card"
                        />
                        {isOwner && (
                            <label className="absolute -bottom-1 -right-1 p-1.5 bg-gradient-main rounded-lg cursor-pointer shadow-glow">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            {/* Channel Info */}
            <div className="pt-16 px-6 pb-6 border-b border-gray-100 dark:border-dark-600">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                            {channel.fullName}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">@{channel.username}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                <strong className="text-gray-900 dark:text-white">{channel.subscribersCount}</strong> subscribers
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                <strong className="text-gray-900 dark:text-white">{channel.channelsSubscribedToCount}</strong> subscriptions
                            </span>
                        </div>
                    </div>

                    {!isOwner && (
                        <button onClick={handleSubscribe}
                            className={`px-5 py-2 text-sm font-medium rounded-xl transition-all ${subscribed
                                ? "bg-gray-100 dark:bg-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-500"
                                : "bg-gradient-main text-white hover:opacity-90 shadow-glow"
                                }`}>
                            {subscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    )}
                </div>
            </div>

            {/* Videos */}
            <div className="px-6 py-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Videos ({channelVideos.length})
                </h2>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-gray-100 dark:bg-dark-700 animate-pulse">
                                <div className="aspect-video bg-gray-200 dark:bg-dark-600 rounded-t-2xl" />
                                <div className="p-3 space-y-2">
                                    <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : channelVideos.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400">No videos uploaded yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {channelVideos.map(video => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}