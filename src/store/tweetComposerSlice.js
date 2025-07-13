import { createSlice } from "@reduxjs/toolkit";
import { createTweet } from "./feedSlice"; // assuming this posts the tweet

const initialState = {
  text: "",
  image: null,
  isPosting: false,
  error: null,
};

const tweetComposerSlice = createSlice({
  name: "tweetComposer",
  initialState,
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
    attachImage: (state, action) => {
      state.image = action.payload;
    },
    clearComposer: (state) => {
      state.text = "";
      state.image = null;
      state.isPosting = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTweet.pending, (state) => {
        state.isPosting = true;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state) => {
        state.isPosting = false;
        state.text = "";
        state.image = null;
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.isPosting = false;
        state.error = action.payload || "Failed to post tweet.";
      });
  },
});

export const { setText, attachImage, clearComposer } = tweetComposerSlice.actions;
export default tweetComposerSlice.reducer;
