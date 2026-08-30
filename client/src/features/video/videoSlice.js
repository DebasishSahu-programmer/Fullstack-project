import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axios"

export const getAllVideos = createAsyncThunk(
    "video/getAll",
    async ({ page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId = "" } = {}, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/videos", {
                params: { page, limit, query, sortBy, sortType, userId }
            })
            return res.data
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || "Failed to fetch videos",
                statusCode: error.response?.status
            })
        }
    }
)

export const getVideoById = createAsyncThunk(
    "video/getById",
    async (videoId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/videos/${videoId}`)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch video")
        }
    }
)

export const publishVideo = createAsyncThunk(
    "video/publish",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/videos", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to publish video")
        }
    }
)

export const updateVideo = createAsyncThunk(
    "video/update",
    async ({ videoId, formData }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(`/videos/${videoId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update video")
        }
    }
)

export const deleteVideo = createAsyncThunk(
    "video/delete",
    async (videoId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/videos/${videoId}`)
            return { ...res.data, videoId }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete video")
        }
    }
)

export const togglePublishStatus = createAsyncThunk(
    "video/togglePublish",
    async (videoId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(`/videos/toggle/publish/${videoId}`)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to toggle publish")
        }
    }
)

const videoSlice = createSlice({
    name: "video",
   initialState: {
    videos: [],
    currentVideo: null,
    loading: false,
    error: null,
    unauthorized: false,
    totalPages: 0,
    currentPage: 1,
},
    reducers: {
        clearCurrentVideo: (state) => { state.currentVideo = null },
        clearError: (state) => { state.error = null }
    },
    extraReducers: (builder) => {
        builder
    .addCase(getAllVideos.pending, (state) => {
        state.loading = true
        state.error = null
        state.unauthorized = false
    })
    .addCase(getAllVideos.fulfilled, (state, action) => {
        state.loading = false
        state.videos = action.payload.data.docs
        state.totalPages = action.payload.data.totalPages
        state.currentPage = action.payload.data.page
    })
    .addCase(getAllVideos.rejected, (state, action) => {
        state.loading = false
        if (action.payload?.statusCode === 401) {
            state.unauthorized = true
        } else {
            state.error = action.payload?.message
        }
    })
          

        builder
            .addCase(getVideoById.pending, (state) => { state.loading = true; state.error = null })
            .addCase(getVideoById.fulfilled, (state, action) => { state.loading = false; state.currentVideo = action.payload.data })
            .addCase(getVideoById.rejected, (state, action) => { state.loading = false; state.error = action.payload })

        builder.addCase(publishVideo.fulfilled, (state, action) => { state.videos.unshift(action.payload.data) })

        builder.addCase(deleteVideo.fulfilled, (state, action) => {
            state.videos = state.videos.filter(v => v._id !== action.payload.videoId)
        })

        builder.addCase(togglePublishStatus.fulfilled, (state, action) => {
            const index = state.videos.findIndex(v => v._id === action.payload.data._id)
            if (index !== -1) state.videos[index] = action.payload.data
        })
    }
})

export const { clearCurrentVideo, clearError } = videoSlice.actions
export default videoSlice.reducer