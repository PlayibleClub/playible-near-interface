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

const processSalesListData = (data) => {
  const processedData = []
  data.forEach((item) => {
    processedData.push({
      id: item.asset,
      tokenID: item.token_id,
      collection: item.collection,
      asset: item.asset,
      price: item.price,
      signed_message: item.signed_message,
      message: item.message,

      name: 'STEPHEN CURRY',
      team: 'Golden State Warriors',
      athlete_id: '320',
      jersey: '30',
      positions: ['PG', 'SG'],
      avgscore: '86.3',
      grad1: 'indigo-blue',
      grad2: 'indigo-bluegrad',
      listing: '12/12/2024',
      rarity: 'base',
    })
  });

  return processedData
}

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
        list: processSalesListData(action.payload.response.data),
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