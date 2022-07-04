/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  txResults: null,
  txError: null,
};

const walletSlice = createSlice({
  name: 'near_wallet',
  initialState: initialState,
  reducers: {},
  extraReducers: {},
});

export const { execute } = walletSlice.actions;
export default walletSlice.reducer;
