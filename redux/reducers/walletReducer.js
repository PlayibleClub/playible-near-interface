/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import TerraEnv from '../../utils/terra';

const { terra } = TerraEnv();

export const connectVerifyWallet = createAsyncThunk('connectVerifyWallet',
  async (payload, _thunkAPI) => {
    const result = await terra.auth.accountInfo(payload.wallet);
    return {
      result,
    };
  });

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    address: '',
    accountNumber: null,
    coins: [],
  },
  reducers: {},
  extraReducers: {
    [connectVerifyWallet.fulfilled]: (state, action) => {
      const { account_number: accountNumber, address, coins } = action.payload.result;
      return { ...state,
        accountNumber,
        address,
        coins: coins.toData(),
      };
    },
  },
});

export default walletSlice.reducer;
