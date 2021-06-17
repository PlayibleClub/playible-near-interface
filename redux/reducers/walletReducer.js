import { createSlice } from '@reduxjs/toolkit';

const walletSlice = createSlice({
  name: 'wallet',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
  },
});

export default walletSlice.reducer;
