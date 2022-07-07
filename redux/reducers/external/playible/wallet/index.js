/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../../../utils/playible';
import * as statusCode from '../../../../../data/constants/status';
import * as actionType from '../../../../../data/constants/actions';
import * as contracts from '../../../../../data/constants/contracts';

const initialState = {
  data: null,
  message: '',
  status: statusCode.IDLE,
  action: '',
};

export const getConnection = createAsyncThunk('getConnection', async (payload, thunkAPI) => {
  try {
    const { connection = null, clear = false } = payload;
    let result = null;
    if (clear) {
      result = null;
    } else {
      result = await connection
    }
    return {
      response: result,
      status: statusCode.SUCCESS,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue({
      response: err,
      status: statusCode.ERROR,
    });
  }
});


const assetSlice = createSlice({
  name: 'asset',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    [getConnection.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET,
      };
    },
    [getConnection.fulfilled]: (state, action) => {
      return {
        ...state,
        data: action.payload.response,
        status: action.payload.status,
        action: actionType.GET,
      };
    },
    [getConnection.rejected]: (state, action) => {
      return {
        ...state,
        data: null,
        status: action.payload.status,
        action: actionType.GET,
      };
    },
  },
});

export const { clearData } = assetSlice.actions;
export default assetSlice.reducer;
