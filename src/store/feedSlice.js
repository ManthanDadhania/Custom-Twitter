import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import databaseService from "../appwrite/databaseService";
import { Query } from "appwrite";

const initialState = {
  posts: [],       // ✅ store fetched tweets here
  title: null,
  images: null,
  userId: null,
  status: null,
  error: null,
  loading: false,
};

// ✅ CREATE TWEET
export const createTweet = createAsyncThunk(
  "feed/createTweet",
  async ({ docId, title, images, status, userId }, thunkAPI) => {
    try {
      return await databaseService.createPost({ docId, title, images, status, userId });
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to create Tweet.");
    }
  }
);

// ✅ DELETE TWEET
export const deleteTweet = createAsyncThunk(
  "feed/deleteTweet",
  async (docId, thunkAPI) => {
    try {
      return await databaseService.deletePost(docId);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to delete Tweet.");
    }
  }
);

// ✅ UPDATE TWEET
export const updateTweet = createAsyncThunk(
  "feed/updateTweet",
  async ({ docId, title, images, status, userId }, thunkAPI) => {
    try {
      return await databaseService.updatePost(docId, { title, images, status, userId });
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update Tweet.");
    }
  }
);

// ✅ GET ALL TWEETS
export const getTweets = createAsyncThunk(
  "feed/getTweets",
  async (_, thunkAPI) => {
    try {
      return await databaseService.getPosts(); // already filtered inside your service
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch Tweets.");
    }
  }
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.title = action.payload.title;
        state.images = action.payload.images;
        state.status = action.payload.status;
        state.userId = action.payload.userId;
        state.posts.unshift(action.payload); // optional: add new tweet to top
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = state.posts.filter(post => post.$id !== action.meta.arg); // meta.arg = docId
      })
      .addCase(deleteTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.posts.findIndex(post => post.$id === action.payload.$id);
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(updateTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getTweets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTweets.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = action.payload.documents || []; // Appwrite returns {documents: [...]}
      })
      .addCase(getTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default feedSlice.reducer;