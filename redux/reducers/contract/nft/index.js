/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { executeContract, estimateFee, queryContract, retrieveTxInfo } from '../../../../utils/terra';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { fantasyData, tokenData } from '../../../../data';
import * as statusCode from '../../../../data/constants/status';
import * as statusMessage from '../../../../data/constants/statusMessage';
import * as actionType from '../../../../data/constants/actions';


const initialState = {
  txInfo: null,
  txResponse: null,
  txFee: 0,
  message: '',
  status: statusCode.IDLE,
  action: ''
}

const nftSlice = createSlice({
  name: 'nft',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    
  },
});

export const { clearData } = nftSlice.actions;
export default nftSlice.reducer;
