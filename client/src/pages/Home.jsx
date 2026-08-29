import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router"
import { getAllVideos } from "../features/video/videoSlice"
import VideoCard from "../components/VideoCard"

export default function Home() {
    const dispatch = useDispatch()
    const { videos, loading, error, totalPages, currentPage } = useSelector(state => state.video)
    const [searchParams] = useSearchParams()
    const query = searchParams.get("query") || ""
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(1)
        dispatch(getAllVideos({ query, page: 1 }))
    }, [query])

    const loadMore = () => {
        const next = page + 1
        setPage(next)
        dispatch(getAllVideos({ query, page: next }))
    }

    return (
        <div className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">

            {/* Search result header */}
            {query && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Results for <span className="text-primary-500">"{query}"</span>
                    </h2>
                </div>
            )}

            {/* Hero — only on home */}
            {!query && (
                <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-hero p-8 md:p-12">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
                    </div>
                    <div className="relative">
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                            Discover Videos
                        </h1>
                        <p className="text-gray-300 text-sm md:text-base">
                            Watch, share and connect with creators around the world.
                        </p>
                    </div>
                </div>
            )}

            {/* Skeleton loading */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="rounded-2xl bg-gray-100 dark:bg-dark-700 animate-pulse">
                            <div className="aspect-video bg-gray-200 dark:bg-dark-600 rounded-t-2xl" />
                            <div className="p-3 flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-dark-600 shrink-0" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 dark:bg-dark-600 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {error && !loading && (
                <div className="text-center py-20">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={() => dispatch(getAllVideos({ query }))}
                        className="px-4 py-2 text-sm text-white bg-gradient-main rounded-xl hover:opacity-90 transition-all">
                        Try again
                    </button>
                </div>
            )}

            {/* Videos grid */}
            {!loading && !error && (
                <>
                    {videos.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-dark-700 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                {query ? "No videos found for your search." : "No videos yet. Be the first to upload!"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {videos.map(video => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    )}

                    {/* Load more */}
                    {currentPage < totalPages && (
                        <div className="flex justify-center mt-8">
                            <button onClick={loadMore}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-main rounded-xl hover:opacity-90 shadow-glow transition-all">
                                Load more
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}