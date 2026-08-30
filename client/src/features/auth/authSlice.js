import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axios"

export const registerUser = createAsyncThunk(
    "auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/users/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Registration failed")
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/users/login", data)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login failed")
        }
    }
)

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/users/logout")
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Logout failed")
        }
    }
)

export const getCurrentUser = createAsyncThunk(
    "auth/getCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/users/current-user")
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to get user")
        }
    }
)

export const updateUserAvatar = createAsyncThunk(
    "auth/updateAvatar",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch("/users/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update avatar")
        }
    }
)

export const updateUserCoverImage = createAsyncThunk(
    "auth/updateCoverImage",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch("/users/cover-image", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update cover image")
        }
    }
)

export const getUserChannelProfile = createAsyncThunk(
    "auth/getChannelProfile",
    async (username, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/users/c/${username}`)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to get channel")
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        channel: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => { state.error = null }
    },
    extraReducers: (builder) => {
        // register
        builder
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null })
            .addCase(registerUser.fulfilled, (state) => { state.loading = false })
            .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })

        // login
        builder
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.data.user
                state.isAuthenticated = true
                localStorage.setItem("isLoggedIn", "true") 
            })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload })

        // logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null
            state.isAuthenticated = false
             localStorage.removeItem("isLoggedIn")
        })

        // getCurrentUser
        builder
            .addCase(getCurrentUser.pending, (state) => { state.loading = true })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.data
                state.isAuthenticated = true
            })
            .addCase(getCurrentUser.rejected, (state) => { state.loading = false; state.isAuthenticated = false })

        // updateAvatar
        builder.addCase(updateUserAvatar.fulfilled, (state, action) => { state.user = action.payload.data })

        // updateCoverImage
        builder.addCase(updateUserCoverImage.fulfilled, (state, action) => { state.user = action.payload.data })

        // getChannelProfile
        builder
            .addCase(getUserChannelProfile.pending, (state) => { state.loading = true })
            .addCase(getUserChannelProfile.fulfilled, (state, action) => {
                state.loading = false
                state.channel = action.payload.data
            })
            .addCase(getUserChannelProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload })
    }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer