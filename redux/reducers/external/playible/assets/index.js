/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../../../utils/playible'
import * as statusCode from '../../../../../data/constants/status'
import * as actionType from '../../../../../data/constants/actions'
import * as contracts from '../../../../../data/constants/contracts'

const initialState = {
  list: null,
  message: '',
  status: statusCode.IDLE,
  action: ''
}

export const getAccountAssets = createAsyncThunk('getAccountAssets', async (payload, thunkAPI) => {
  try {
    const { walletAddr, clear = false } = payload
    let result = null
    if (clear) {
      result = null
    } else {
      result = await axiosInstance.get(
        // `/account/athlete_tokens/${walletAddr}/collection/${contracts.ATHLETE}`
        `/account/athlete_tokens/${walletAddr}/collection/${contracts.ATHLETE}`
      )

      if (result.status !== 200) {
        result = null
      }
    }

    return {
      response: result,
      status: statusCode.SUCCESS
    }
  } catch (err) {
    return thunkAPI.rejectWithValue({
      response: err,
      status: statusCode.ERROR
    })
  }
})

const processAssetListData = (data) => {
  const processedData = data

  if (Array.isArray(data)) {
    alert('you are in testnet')
    return null
  }
  return processedData
}

const assetSlice = createSlice({
  name: 'asset',
  initialState: initialState,
  reducers: {
    clearData: () => initialState
  },
  extraReducers: {
    [getAccountAssets.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET
      }
    },
    [getAccountAssets.fulfilled]: (state, action) => {
      return {
        ...state,
        list: processAssetListData(action.payload.response ? action.payload.response.data : null),
        status: action.payload.status,
        action: actionType.GET
      }
    },
    [getAccountAssets.rejected]: (state, action) => {
      return {
        ...state,
        list: null,
        status: action.payload.status,
        action: actionType.GET
      }
    }
  }
})

export const { clearData } = assetSlice.actions
export default assetSlice.reducer
