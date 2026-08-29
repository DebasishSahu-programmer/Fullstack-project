import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getLikedVideos } from "../features/like/likeSlice"
import VideoCard from "../components/VideoCard"

export default function LikedVideos() {
    const dispatch = useDispatch()
    const { likedVideos, loading } = useSelector(state => state.like)

    useEffect(() => {
        dispatch(getLikedVideos())
    }, [])

    return (
        <div className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <div>
                    <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">Liked Videos</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{likedVideos.length} videos</p>
                </div>
            </div>

            {/* Skeleton */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-2xl bg-gray-100 dark:bg-dark-700 animate-pulse">
                            <div className="aspect-video bg-gray-200 dark:bg-dark-600 rounded-t-2xl" />
                            <div className="p-3 space-y-2">
                                <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Videos */}
            {!loading && (
                likedVideos.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-dark-700 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No liked videos yet.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Like a video and it will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {likedVideos.map(({ video }) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                )
            )}
        </div>
    )
}