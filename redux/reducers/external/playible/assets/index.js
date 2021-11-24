/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, generateAuth } from '../../../../utils/statsperform';
import { checkResponseValidity } from '../../../../utils/general';

export const listAssets = createAsyncThunk('listAssets', async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/participants' + generateAuth());
    const { response: validatedResponse, valid } = checkResponseValidity(response);

    if (valid) {
      return validatedResponse;
    }
    else {
      return thunkAPI.rejectWithValue(validatedResponse);
    }
  } catch (err) {
    return thunkAPI.rejectWithValue({});
  }
});

const assetSlice = createSlice({
  name: 'player',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    [listAssets.pending]: (state) => {
      return {
        ...state,
      };
    },
    [listAssets.fulfilled]: (state, action) => {
      return {
        ...state,
      };
    },
    [listAssets.rejected]: (state, action) => {
      return {
        ...state,
      };
    },
  },
});

export default assetSlice.reducer;
