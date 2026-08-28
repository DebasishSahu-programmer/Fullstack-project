import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateComment, deleteComment } from "../features/comment/commentSlice"
import { toggleCommentLike } from "../features/like/likeSlice"

export default function Comment({ comment }) {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const [editing, setEditing] = useState(false)
    const [content, setContent] = useState(comment.content)
    const [liked, setLiked] = useState(comment.isLiked)
    const [likesCount, setLikesCount] = useState(comment.likesCount || 0)

    const isOwner = user?._id === comment.owner?._id

    const formatDate = (date) => {
        const d = new Date(date)
        const now = new Date()
        const diff = Math.floor((now - d) / 1000)
        if (diff < 60) return "just now"
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        return `${Math.floor(diff / 86400)}d ago`
    }

    const handleUpdate = async () => {
        if (!content.trim()) return
        await dispatch(updateComment({ commentId: comment._id, content }))
        setEditing(false)
    }

    const handleDelete = () => {
        dispatch(deleteComment(comment._id))
    }

    const handleLike = async () => {
        setLiked(!liked)
        setLikesCount(liked ? likesCount - 1 : likesCount + 1)
        await dispatch(toggleCommentLike(comment._id))
    }

    return (
        <div className="flex gap-3">
            <img
                src={comment.owner?.avatar || `https://ui-avatars.com/api/?name=${comment.owner?.username}`}
                alt={comment.owner?.username}
                className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        @{comment.owner?.username}
                    </span>
                    <span className="text-xs text-gray-400">
                        {formatDate(comment.createdAt)}
                    </span>
                </div>

                {/* Content or Edit */}
                {editing ? (
                    <div className="flex flex-col gap-2">
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-gray-100 dark:bg-dark-600 text-gray-900 dark:text-white border border-gray-200 dark:border-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        />
                        <div className="flex gap-2">
                            <button onClick={handleUpdate}
                                className="px-3 py-1 text-xs font-medium text-white bg-gradient-main rounded-lg hover:opacity-90 transition-all">
                                Save
                            </button>
                            <button onClick={() => { setEditing(false); setContent(comment.content) }}
                                className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-600 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-500 transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 mt-1.5">
                    <button onClick={handleLike}
                        className={`flex items-center gap-1 text-xs transition-all ${liked ? "text-primary-500" : "text-gray-400 hover:text-primary-500"}`}>
                        <svg className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {likesCount}
                    </button>

                    {isOwner && !editing && (
                        <>
                            <button onClick={() => setEditing(true)}
                                className="text-xs text-gray-400 hover:text-primary-500 transition-all">
                                Edit
                            </button>
                            <button onClick={handleDelete}
                                className="text-xs text-gray-400 hover:text-red-500 transition-all">
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}