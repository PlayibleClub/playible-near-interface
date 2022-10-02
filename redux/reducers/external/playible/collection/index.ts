/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore:next-line
import { axiosInstance, generateAuth } from 'utils/statsperform';
// @ts-ignore:next-line
import { checkResponseValidity } from 'utils/general';

export const listCollection = createAsyncThunk('listCollection', async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/participants' + generateAuth());
    const { response: validatedResponse, valid } = checkResponseValidity(response);

    if (valid) {
      return validatedResponse;
    } else {
      return thunkAPI.rejectWithValue(validatedResponse);
    }
  } catch (err) {
    return thunkAPI.rejectWithValue({});
  }
});

const collectionSlice = createSlice({
  name: 'player',
  // @ts-ignore:next-line
  initialState: initialState,
  reducers: {
    // @ts-ignore:next-line
    clearData: () => initialState,
  },
  extraReducers: {
    // @ts-ignore:next-line
    [listCollection.pending]: (state) => {
      return {
        ...state,
      };
    },
    // @ts-ignore:next-line
    [listCollection.fulfilled]: (state, action) => {
      return {
        ...state,
      };
    },
    // @ts-ignore:next-line
    [listCollection.rejected]: (state, action) => {
      return {
        ...state,
      };
    },
  },
});

export default collectionSlice.reducer;
