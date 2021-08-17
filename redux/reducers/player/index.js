/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, generateAuth } from '../../../utils/statsperform';

export const listPlayer = createAsyncThunk('listPlayer', async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/participants' + generateAuth());
    return response;
  } catch (err) {
    return thunkAPI.rejectWithValue({});
  }
});

const initialState = {}

const playerSlice = createSlice({
  name: 'player',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    [listPlayer.pending]: (state) => {
      return {
        ...state,
      };
    },
    [listPlayer.fulfilled]: (state, action) => {
      return {
        ...state,
      };
    },
    [listPlayer.rejected]: (state, action) => {
      return {
        ...state,
      };
    },
  },
});

export default playerSlice.reducer;
