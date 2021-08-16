/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, generateAuth } from '../../../utils/statsperform';

export const listPlayer = createAsyncThunk('listPlayer', async (payload, thunkAPI) => {
  const data = {
    username: payload.username,
    password: payload.password,
  };
  try {
    console.log("PLAYER" + '/participants' + generateAuth())
    const response = await axiosInstance.post('/participants' + generateAuth(), data);

    return response;
  } catch (err) {
    return thunkAPI.rejectWithValue({});
  }
});

const playerSlice = createSlice({
  name: 'player',
  initialState: {
  },
  reducers: {
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
  extraReducers: {},
});

export default playerSlice.reducer;
