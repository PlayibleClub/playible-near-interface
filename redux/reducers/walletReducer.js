/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import TerraEnv from '../../utils/terra';

const { terra } = TerraEnv();

export const connectVerifyWallet = createAsyncThunk('connectVerifyWallet',
  async (payload, { rejectWithValue }) => {
    try {
      const { account_number: accountNumber,
        address, coins } = await terra.auth.accountInfo(payload.wallet);

      return {
        accountNumber,
        address,
        coins: coins.toData(),
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  });

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    address: '',
    accountNumber: '',
    coins: [],
    loading: true,
    error: false,
    errorMessage: '',
  },
  reducers: {},
  extraReducers: {
    [connectVerifyWallet.pending]: (state) => ({ ...state,
      accountNumber: '',
      address: '',
      coins: [],
      loading: true,
      error: false,
      errorMessage: '',
    }),
    [connectVerifyWallet.fulfilled]: (state, action) => ({ ...state,
      ...action.payload,
      loading: false,
    }),
    [connectVerifyWallet.rejected]: (state, action) => ({ ...state,
      accountNumber: '',
      address: '',
      coins: [],
      loading: false,
      error: true,
      errorMessage: action.payload,
    }),
  },
});

export default walletSlice.reducer;
