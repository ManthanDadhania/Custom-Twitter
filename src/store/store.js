import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import feedSlice from './feedSlice'
import profileSlice from './profileSlice'
import tweetComposerSlice from './tweetComposerSlice'
const store =configureStore({
    reducer:{
        auth:authSlice,
        profile:profileSlice,
        feed:feedSlice,
        tweetComposer:tweetComposerSlice
    }
})
export default store;