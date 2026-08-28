import { Link } from "react-router"

export default function VideoCard({ video }) {
    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
        return views
    }

    const formatDate = (date) => {
        const d = new Date(date)
        const now = new Date()
        const diff = Math.floor((now - d) / 1000)
        if (diff < 60) return "just now"
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
        return `${Math.floor(diff / 2592000)}mo ago`
    }

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        return `${m}:${s.toString().padStart(2, "0")}`
    }

    return (
        <Link to={`/video/${video._id}`} className="group block">
            <div className="rounded-2xl overflow-hidden bg-white dark:bg-dark-700 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-dark-600">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">
                        {formatDuration(video.duration)}
                    </span>
                </div>

                {/* Info */}
                <div className="p-3 flex gap-3">
                    <img
                        src={video.owner?.avatar || `https://ui-avatars.com/api/?name=${video.owner?.username}`}
                        alt={video.owner?.username}
                        className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 leading-snug">
                            {video.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            @{video.owner?.username}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            {formatViews(video.views)} views • {formatDate(video.createdAt)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}