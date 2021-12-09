/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../../../utils/playible';
import * as statusCode from '../../../../../data/constants/status';
import * as actionType from '../../../../../data/constants/actions';

const initialState = {
  list: [],
  message: '',
  status: statusCode.IDLE,
  action: ''
}

export const getSalesOrders = createAsyncThunk('getSalesOrders', async (payload, thunkAPI) => {
  try {
    const result = await axiosInstance.get('/account/sales/');
    return {
      response: result,
      status: statusCode.SUCCESS
    }
  } catch (err) {
    return thunkAPI.rejectWithValue({
      response: err,
      status: statusCode.ERROR
    });
  }
});

export const createSalesOrder = createAsyncThunk(
  'createSalesOrder',
  async (payload, thunkAPI) => {
    try {
      const result = await axiosInstance.post(`/account/sales/`, payload);
      return {
        response: result,
        status: statusCode.SUCCESS
      }
    } catch (err) {
      return thunkAPI.rejectWithValue({
        response: err,
        status: statusCode.ERROR
      });
    }
  }
);

const salesOrderSlice = createSlice({
  name: 'salesOrder',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    [getSalesOrders.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET
      };
    },
    [getSalesOrders.fulfilled]: (state, action) => {
      return {
        ...state,
        list: action.payload.response,
        status: action.payload.status,
        action: actionType.GET
      };
    },
    [getSalesOrders.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.GET
      };
    },
    [createSalesOrder.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.CREATE
      };
    },
    [createSalesOrder.fulfilled]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.CREATE
      };
    },
    [createSalesOrder.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.CREATE
      };
    },
  },
});

export const { clearData } = salesOrderSlice.actions;
export default salesOrderSlice.reducer;