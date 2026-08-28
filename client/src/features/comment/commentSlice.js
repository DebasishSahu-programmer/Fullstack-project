import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axios"

export const getVideoComments = createAsyncThunk(
    "comment/getAll",
    async ({ videoId, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/comments/${videoId}`, {
                params: { page, limit }
            })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch comments")
        }
    }
)

export const addComment = createAsyncThunk(
    "comment/add",
    async ({ videoId, content }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/comments/${videoId}`, { content })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add comment")
        }
    }
)

export const updateComment = createAsyncThunk(
    "comment/update",
    async ({ commentId, content }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(`/comments/c/${commentId}`, { content })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update comment")
        }
    }
)

export const deleteComment = createAsyncThunk(
    "comment/delete",
    async (commentId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/comments/c/${commentId}`)
            return { ...res.data, commentId }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete comment")
        }
    }
)

const commentSlice = createSlice({
    name: "comment",
    initialState: {
        comments: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearComments: (state) => { state.comments = [] }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVideoComments.pending, (state) => { state.loading = true })
            .addCase(getVideoComments.fulfilled, (state, action) => {
                state.loading = false
                state.comments = action.payload.data.docs
            })
            .addCase(getVideoComments.rejected, (state, action) => { state.loading = false; state.error = action.payload })

        builder.addCase(addComment.fulfilled, (state, action) => { state.comments.unshift(action.payload.data) })

        builder.addCase(updateComment.fulfilled, (state, action) => {
            const index = state.comments.findIndex(c => c._id === action.payload.data._id)
            if (index !== -1) state.comments[index] = action.payload.data
        })

        builder.addCase(deleteComment.fulfilled, (state, action) => {
            state.comments = state.comments.filter(c => c._id !== action.payload.commentId)
        })
    }
})

export const { clearComments } = commentSlice.actions
export default commentSlice.reducer