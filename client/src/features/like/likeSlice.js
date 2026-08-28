import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axios"

export const toggleVideoLike = createAsyncThunk(
    "like/toggleVideo",
    async (videoId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/likes/toggle/v/${videoId}`)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to toggle like")
        }
    }
)

export const toggleCommentLike = createAsyncThunk(
    "like/toggleComment",
    async (commentId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/likes/toggle/c/${commentId}`)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to toggle like")
        }
    }
)

export const getLikedVideos = createAsyncThunk(
    "like/getLikedVideos",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/likes/videos")
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch liked videos")
        }
    }
)

const likeSlice = createSlice({
    name: "like",
    initialState: {
        likedVideos: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getLikedVideos.pending, (state) => { state.loading = true })
            .addCase(getLikedVideos.fulfilled, (state, action) => {
                state.loading = false
                state.likedVideos = action.payload.data
            })
            .addCase(getLikedVideos.rejected, (state, action) => { state.loading = false; state.error = action.payload })
    }
})

export default likeSlice.reducer