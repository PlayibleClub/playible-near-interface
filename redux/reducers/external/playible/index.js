/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, generateAuth } from '../../../../utils/statsperform';
import { checkResponseValidity } from '../../../../utils/general';

export const playible = createAsyncThunk('playible', async (payload, thunkAPI) => {
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

const processPlayibleData = (data) => {
  const processedData = []

  

  return processedData;
}

const initialState = {
}

const playibleSlice = createSlice({
  name: 'player',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    [playible.pending]: (state) => {
      return {
        ...state,
      };
    },
    [playible.fulfilled]: (state, action) => {
      return {
        ...state,
      };
    },
    [playible.rejected]: (state, action) => {
      return {
        ...state,
      };
    },
  },
});

export default playibleSlice.reducer;
