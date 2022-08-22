/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, generateAuth } from 'utils/statsperform';
import { checkResponseValidity } from 'utils/general';

export const fantasy = createAsyncThunk('fantasy', async (payload, thunkAPI) => {
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

const processFantasyData = (data) => {
  const processedData = [];

  return processedData;
};

const initialState = {};

const fantasySlice = createSlice({
  name: 'player',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    // @ts-ignore:next-line
    [fantasy.pending]: (state) => {
      return {
        ...state,
      };
    },
    // @ts-ignore:next-line
    [fantasy.fulfilled]: (state, action) => {
      return {
        ...state,
      };
    },
    // @ts-ignore:next-line
    [fantasy.rejected]: (state, action) => {
      return {
        ...state,
      };
    },
  },
});

export default fantasySlice.reducer;
