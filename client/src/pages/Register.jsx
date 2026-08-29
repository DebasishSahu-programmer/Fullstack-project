import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { registerUser, clearError } from "../features/auth/authSlice"

export default function Register() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error } = useSelector(state => state.auth)

    const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" })
    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [coverPreview, setCoverPreview] = useState(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        return () => dispatch(clearError())
    }, [])

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleAvatar = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatar(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleCover = (e) => {
        const file = e.target.files[0]
        if (file) {
            setCoverImage(file)
            setCoverPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        Object.entries(form).forEach(([k, v]) => formData.append(k, v))
        if (avatar) formData.append("avatar", avatar)
        if (coverImage) formData.append("coverImage", coverImage)

        const result = await dispatch(registerUser(formData))
        if (registerUser.fulfilled.match(result)) {
            setSuccess(true)
            setTimeout(() => navigate("/login"), 2000)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 px-4 py-10">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card border border-gray-100 dark:border-dark-600 p-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-main flex items-center justify-center shadow-glow mb-3">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join VideoTube today</p>
                    </div>

                    {/* Success */}
                    {success && (
                        <div className="mb-4 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-600 dark:text-green-400">
                            Account created! Redirecting to login...
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Cover + Avatar */}
                    <div className="relative mb-8">
                        <div
                            className="w-full h-24 rounded-xl bg-linear-to-r from-primary-500/20 to-accent-500/20 border-2 border-dashed border-gray-200 dark:border-dark-500 overflow-hidden cursor-pointer hover:border-primary-500 transition-all"
                            onClick={() => document.getElementById("cover").click()}
                        >
                            {coverPreview
                                ? <img src={coverPreview} className="w-full h-full object-cover" alt="cover" />
                                : <div className="flex flex-col items-center justify-center h-full gap-1">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs text-gray-400">Cover image (optional)</span>
                                </div>
                            }
                        </div>
                        <input id="cover" type="file" accept="image/*" onChange={handleCover} className="hidden" />

                        {/* Avatar */}
                        <div
                            className="absolute -bottom-6 left-4 w-14 h-14 rounded-full border-4 border-white dark:border-dark-800 bg-gray-100 dark:bg-dark-600 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
                            onClick={() => document.getElementById("avatar").click()}
                        >
                            {avatarPreview
                                ? <img src={avatarPreview} className="w-full h-full object-cover" alt="avatar" />
                                : <div className="flex items-center justify-center w-full h-full">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            }
                        </div>
                        <input id="avatar" type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Full Name</label>
                                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required
                                    placeholder="John Doe"
                                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Username</label>
                                <input type="text" name="username" value={form.username} onChange={handleChange} required
                                    placeholder="johndoe"
                                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all" />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Password</label>
                            <input type="password" name="password" value={form.password} onChange={handleChange} required
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all" />
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-gradient-main rounded-xl hover:opacity-90 shadow-glow transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : "Create account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium transition-all">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}