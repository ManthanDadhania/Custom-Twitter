import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import profileDetails from "../appwrite/profileService";


const initialState = {
  loading: false,
  error: null,
  bio: "",
  profileImage: "",
  username: "",
};


export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (userId, thunkAPI) => {
    try {
      return await profileDetails.getUserProfile(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch user profile.");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async ({ userId, username, bio, profileImage }, thunkAPI) => {
    try {
      return await profileDetails.updateUserProfile(userId, {
        username,
        bio,
        profileImage,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update user profile.");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.bio = action.payload.bio;
        state.profileImage = action.payload.profileImage;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.bio = action.payload.bio;
        state.profileImage = action.payload.profileImage;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;