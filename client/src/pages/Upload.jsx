import { useState } from "react"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { publishVideo } from "../features/video/videoSlice"

export default function Upload() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading } = useSelector(state => state.video)

    const [form, setForm] = useState({ title: "", description: "" })
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailPreview, setThumbnailPreview] = useState(null)
    const [error, setError] = useState("")

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleThumbnail = (e) => {
        const file = e.target.files[0]
        if (file) {
            setThumbnail(file)
            setThumbnailPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        if (!videoFile) return setError("Please select a video file")
        if (!thumbnail) return setError("Please select a thumbnail")

        const formData = new FormData()
        formData.append("title", form.title)
        formData.append("description", form.description)
        formData.append("videoFile", videoFile)
        formData.append("thumbnail", thumbnail)

        const result = await dispatch(publishVideo(formData))
        if (publishVideo.fulfilled.match(result)) {
            navigate(`/video/${result.payload.data._id}`)
        } else {
            setError(result.payload || "Upload failed")
        }
    }

    return (
        <div className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-main flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">Upload Video</h1>
            </div>

            {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Video File */}
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Video File <span className="text-red-500">*</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center w-full h-36 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${videoFile
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-gray-200 dark:border-dark-500 bg-gray-50 dark:bg-dark-700 hover:border-primary-400"
                        }`}>
                        {videoFile ? (
                            <div className="flex flex-col items-center gap-2">
                                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{videoFile.name}</p>
                                <p className="text-xs text-gray-400">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload video</p>
                                <p className="text-xs text-gray-400">MP4, WebM, MOV</p>
                            </div>
                        )}
                        <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} className="hidden" />
                    </label>
                </div>

                {/* Thumbnail */}
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Thumbnail <span className="text-red-500">*</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all ${thumbnail
                        ? "border-primary-500"
                        : "border-gray-200 dark:border-dark-500 bg-gray-50 dark:bg-dark-700 hover:border-primary-400"
                        }`}>
                        {thumbnailPreview ? (
                            <img src={thumbnailPreview} className="w-full h-full object-cover" alt="thumbnail preview" />
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload thumbnail</p>
                                <p className="text-xs text-gray-400">JPG, PNG, WebP</p>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
                    </label>
                </div>

                {/* Title */}
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter video title"
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell viewers about your video..."
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all resize-none"
                    />
                </div>

                <button type="submit" disabled={loading}
                    className="w-full py-3 text-sm font-medium text-white bg-gradient-main rounded-xl hover:opacity-90 shadow-glow transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Uploading...
                        </span>
                    ) : "Publish Video"}
                </button>
            </form>
        </div>
    )
}