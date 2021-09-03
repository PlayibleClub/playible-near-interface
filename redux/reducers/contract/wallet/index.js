/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';


//TODO: Execute smart contract in redux with the helper

const initialState = {
  txResults: null,
  txError: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState: initialState,
  reducers: {},
  extraReducers: {},
});

export const { execute } = walletSlice.actions;
export default walletSlice.reducer;
