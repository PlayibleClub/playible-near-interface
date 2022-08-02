/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, generateAuth } from '../../../../utils/statsperform';
import { checkResponseValidity } from '../../../../utils/general';

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
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    [listCollection.pending]: (state) => {
      return {
        ...state,
      };
    },
    [listCollection.fulfilled]: (state, action) => {
      return {
        ...state,
      };
    },
    [listCollection.rejected]: (state, action) => {
      return {
        ...state,
      };
    },
  },
});

export default collectionSlice.reducer;
