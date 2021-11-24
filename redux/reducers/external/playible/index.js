/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, generateAuth } from '../../../../utils/statsperform';
import { checkResponseValidity } from '../../../../utils/general';

export const listPlayer = createAsyncThunk('listPlayer', async (payload, thunkAPI) => {
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

const processPlayerListData = (data) => {
  const processedData = []

  

  return processedData;
}

const initialState = {
  playerList: []
}

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
