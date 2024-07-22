import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  otherUser: null,
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
    getOhterUser: (state, action) => {
      state.otherUser = action.payload;
    },
    getMyProfile: (state, action) => {
      state.profile = action.payload;
    },
    followingUpdate: (state, action) => {
      if (state.user) {
        if (state.user.following.includes(action.payload)) {
          // unfollow
          state.user.following = state.user.following.filter((itemId) => {
            return itemId !== action.payload;
          });
        } else {
          // follow
          state.user.following.push(action.payload);
        }
      }
    },
  },
});

export const { getUser, getOhterUser, getMyProfile, followingUpdate } =
  userSlice.actions;
export default userSlice.reducer;
