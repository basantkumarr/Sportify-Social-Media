// redux/postslice.js
import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    refresh:false,
    isActive:true
  },
  reducers: {
    getAllPost: (state, action) => {
      console.log("Action payload in reducer:", action.payload); // Log the payload to ensure it's correct
      state.posts = action.payload;
    },
    getRefresh:(state)=>{
        state.refresh=!state.refresh;
    },
    getIsActive: (state, action) => {
         state.isActive = action.payload;
      },

  }
});

export const { getAllPost,getRefresh,getIsActive } = postSlice.actions;
export default postSlice.reducer;
