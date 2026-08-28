import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import videoReducer from "../features/video/videoSlice"
import commentReducer from "../features/comment/commentSlice"
import likeReducer from "../features/like/likeSlice"
import subscriptionReducer from "../features/subscription/subscriptionSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        comment: commentReducer,
        like: likeReducer,
        subscription: subscriptionReducer,
    }
})

export default store