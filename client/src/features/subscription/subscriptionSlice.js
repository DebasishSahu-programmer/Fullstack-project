import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/axios"

export const toggleSubscription = createAsyncThunk(
    "subscription/toggle",
    async (channelId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/subscriptions/c/${channelId}`)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to toggle subscription")
        }
    }
)

export const getUserChannelSubscribers = createAsyncThunk(
    "subscription/getSubscribers",
    async (channelId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/subscriptions/u/${channelId}`)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch subscribers")
        }
    }
)

export const getSubscribedChannels = createAsyncThunk(
    "subscription/getChannels",
    async (subscriberId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/subscriptions/c/${subscriberId}`)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch channels")
        }
    }
)

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState: {
        subscribers: [],
        subscribedChannels: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUserChannelSubscribers.fulfilled, (state, action) => {
            state.subscribers = action.payload.data
        })
        builder.addCase(getSubscribedChannels.fulfilled, (state, action) => {
            state.subscribedChannels = action.payload.data
        })
    }
})

export default subscriptionSlice.reducer