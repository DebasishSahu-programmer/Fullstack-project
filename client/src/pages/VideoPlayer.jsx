import { useEffect, useState } from "react"
import { useParams, Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { getVideoById } from "../features/video/videoSlice"
import { getVideoComments, addComment } from "../features/comment/commentSlice"
import { toggleVideoLike } from "../features/like/likeSlice"
import { toggleSubscription } from "../features/subscription/subscriptionSlice"
import Comment from "../components/Comment"

export default function VideoPlayer() {
    const { videoId } = useParams()
    const dispatch = useDispatch()
    const { currentVideo, loading } = useSelector(state => state.video)
    const { comments } = useSelector(state => state.comment)
    const { user, isAuthenticated } = useSelector(state => state.auth)

    const [liked, setLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [subscribed, setSubscribed] = useState(false)
    const [commentText, setCommentText] = useState("")

    useEffect(() => {
        dispatch(getVideoById(videoId))
        dispatch(getVideoComments({ videoId }))
    }, [videoId])

    useEffect(() => {
        if (currentVideo) {
            setLiked(currentVideo.isLiked)
            setLikesCount(currentVideo.likesCount)
            setSubscribed(currentVideo.owner?.isSubscribed)
        }
    }, [currentVideo])

    const handleLike = async () => {
        if (!isAuthenticated) return
        setLiked(!liked)
        setLikesCount(liked ? likesCount - 1 : likesCount + 1)
        await dispatch(toggleVideoLike(videoId))
    }

    const handleSubscribe = async () => {
        if (!isAuthenticated) return
        setSubscribed(!subscribed)
        await dispatch(toggleSubscription(currentVideo.owner._id))
    }

    const handleComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim()) return
        await dispatch(addComment({ videoId, content: commentText }))
        setCommentText("")
    }

    const formatViews = (v) => {
        if (!v) return 0
        if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
        if (v >= 1000) return `${(v / 1000).toFixed(1)}K`
        return v
    }

    if (loading) return (
        <div className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full">
            <div className="aspect-video bg-gray-200 dark:bg-dark-700 rounded-2xl animate-pulse mb-4" />
            <div className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
            </div>
        </div>
    )

    if (!currentVideo) return null

    return (
        <div className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full">
            {/* Video Player */}
            <div className="rounded-2xl overflow-hidden bg-black shadow-card mb-4">
                <video
                    src={currentVideo.videoFile}
                    controls
                    className="w-full aspect-video"
                    poster={currentVideo.thumbnail}
                />
            </div>

            {/* Video Info */}
            <div className="mb-6">
                <h1 className="font-display text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {currentVideo.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Channel */}
                    <div className="flex items-center gap-3">
                        <Link to={`/profile/${currentVideo.owner?.username}`}>
                            <img
                                src={currentVideo.owner?.avatar || `https://ui-avatars.com/api/?name=${currentVideo.owner?.username}`}
                                alt={currentVideo.owner?.username}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500"
                            />
                        </Link>
                        <div>
                            <Link to={`/profile/${currentVideo.owner?.username}`}
                                className="font-medium text-gray-900 dark:text-white hover:text-primary-500 transition-all text-sm block">
                                {currentVideo.owner?.fullName}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {currentVideo.owner?.subscribersCount} subscribers
                            </p>
                        </div>

                        {isAuthenticated && user?._id !== currentVideo.owner?._id && (
                            <button onClick={handleSubscribe}
                                className={`ml-2 px-4 py-1.5 text-sm font-medium rounded-xl transition-all ${subscribed
                                    ? "bg-gray-100 dark:bg-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-500"
                                    : "bg-gradient-main text-white hover:opacity-90 shadow-glow"
                                    }`}>
                                {subscribed ? "Subscribed" : "Subscribe"}
                            </button>
                        )}
                    </div>

                    {/* Like + Views */}
                    <div className="flex items-center gap-3">
                        <button onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium border transition-all ${liked
                                ? "bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400"
                                : "border-gray-200 dark:border-dark-500 text-gray-600 dark:text-gray-400 hover:border-primary-300 hover:text-primary-500"
                                }`}>
                            <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {likesCount} Likes
                        </button>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatViews(currentVideo.views)} views
                        </span>
                    </div>
                </div>

                {/* Description */}
                {currentVideo.description && (
                    <div className="mt-4 px-4 py-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {currentVideo.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Comments */}
            <div>
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {comments.length} Comments
                </h2>

                {/* Add Comment */}
                {isAuthenticated && (
                    <form onSubmit={handleComment} className="flex gap-3 mb-6">
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`}
                            alt={user?.username}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 flex flex-col gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                            />
                            {commentText && (
                                <div className="flex gap-2 self-end">
                                    <button type="button" onClick={() => setCommentText("")}
                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg transition-all">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-main rounded-lg hover:opacity-90 transition-all">
                                        Comment
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                )}

                {/* Comment List */}
                <div className="flex flex-col gap-5">
                    {comments.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-8">
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        comments.map(comment => (
                            <Comment key={comment._id} comment={comment} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}