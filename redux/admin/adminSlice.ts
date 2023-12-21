import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  isAdmin: false,
};

export const adminSlice = createSlice({
  name: 'adminLogin',
  initialState,
  reducers: {
    setIsAdmin(state, action) {
      state.isAdmin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});
export const { setIsAdmin } = adminSlice.actions;

export const getIsAdmin = (state) => state.adminLogin.isAdmin;
export default adminSlice.reducer;
