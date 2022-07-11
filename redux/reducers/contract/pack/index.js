/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  executeContract,
  estimateFee,
  queryContract,
  retrieveTxInfo,
} from '../../../../utils/terra';
import { MsgExecuteContract } from '@terra-money/terra.js';
import { fantasyData, tokenData } from '../../../../data';
import * as statusCode from '../../../../data/constants/status';
import * as statusMessage from '../../../../data/constants/statusMessage';
import * as actionType from '../../../../data/constants/actions';

const initialState = {
  latestRound: null,
  drawList: [],
  txInfo: null,
  txResponse: null,
  txFee: 0,
  message: '',
  packPrice: null,
  status: statusCode.IDLE,
  action: '',
};

export const purchasePack = createAsyncThunk('purchasePack', async (payload, thunkAPI) => {
  try {
    const { connectedWallet, msg } = payload;
    const packPrice = thunkAPI.getState().contract.pack.packPrice;

    //generate seed. Pack length is hardcoded since this is supposed to be used to testing purposes only.
    const packLength = 5;
    let seed = ' ';
    //use lowercase chars and numbers
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    //
    for (let i = 0; i < packLength * 3; i++) {
      seed += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    if (packPrice == null) {
      return thunkAPI.rejectWithValue({
        response: 'Pack Price cannot be null. Please query the pack price from the smart contract.',
        status: statusCode.ERROR,
      });
    }
    const executeMsg = `{ "purchase_pack": { "rand_seed": "${seed}" } }`;
    const coins = {
      uusd: packPrice,
    };
    const result = await executeContract(
      connectedWallet,
      fantasyData.contract_addr,
      executeMsg,
      coins
    );
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

export const getPurchasePackResponse = createAsyncThunk(
  'getPurchasePackResponse',
  async (payload, thunkAPI) => {
    try {
      const txInfo = thunkAPI.getState().contract.pack.txInfo;
      const txResponse = await retrieveTxInfo(txInfo.txHash);
      return {
        response: txResponse.logs[0],
        drawList: txResponse.logs[0].eventsByType.wasm.token_id,
        status: statusCode.CONFIRMED,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue({
        response: err,
        status: statusCode.ERROR,
      });
    }
  }
);

export const getPackPrice = createAsyncThunk('getPackPrice', async (payload, thunkAPI) => {
  try {
    const contractAddr = fantasyData.contract_addr;
    const queryMsg = `{"pack_price":{}}`;
    const result = await queryContract(contractAddr, queryMsg);
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

export const getLastRound = createAsyncThunk('getLastRound', async (payload, thunkAPI) => {
  try {
    const contractAddr = fantasyData.contract_addr;
    const queryMsg = `{"last_round":{}}`;
    const result = await queryContract(contractAddr, queryMsg);
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

export const getRoundData = createAsyncThunk('getRoundData', async (payload, thunkAPI) => {
  try {
    const { lastRound } = payload;

    const contractAddr = fantasyData.contract_addr;
    const queryMsg = `{"purchased_pack":{ "last_round": "${lastRound}" }}`;
    const result = await queryContract(contractAddr, queryMsg);
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

export const estimatePurchaseFee = createAsyncThunk(
  'estimatePurchaseFee',
  async (payload, thunkAPI) => {
    try {
      const { connectedWallet } = payload;
      const packPrice = thunkAPI.getState().contract.pack.packPrice;

      //generate seed. Pack length is hardcoded since this is supposed to be used to testing purposes only.
      const packLength = 5;
      let seed = ' ';
      //use lowercase chars and numbers
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      //
      for (let i = 0; i < packLength * 3; i++) {
        seed += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      if (packPrice == null) {
        return thunkAPI.rejectWithValue({
          response:
            'Pack Price cannot be null. Please query the pack price from the smart contract.',
          status: statusCode.ERROR,
        });
      }

      const executeContractMsg = [
        new MsgExecuteContract(
          connectedWallet.walletAddress, // Wallet Address
          fantasyData.contract_addr, // Contract Address
          JSON.parse(`{ "purchase_pack": { "rand_seed": "${seed}" } }`), // ExecuteMsg
          { uusd: packPrice }
        ),
      ];
      const response = await estimateFee(connectedWallet.walletAddress, executeContractMsg);
      const amount = response.amount._coins.uusd.amount;

      return {
        response: amount.d / 10 ** amount.e, //estimated transaction fee
      };
    } catch (err) {
      return thunkAPI.rejectWithValue({
        response: err,
        status: statusCode.ERROR,
      });
    }
  }
);

const processRoundData = (data) => {
  const processedData = [];
  let i = 0;
  if (data !== null && data.length > 0) {
    data.forEach((item) => {
      const token = tokenData.find((token) => token.symbol === item.slice(0, 3));
      if (typeof token !== 'undefined' && i >= data.length - 6) {
        processedData.push(token.id);
      }
      i++;
    });
  }

  return processedData;
};

const packSlice = createSlice({
  name: 'pack',
  initialState: initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: {
    [purchasePack.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.EXECUTE,
        message: statusMessage.EXECUTE_MESSAGE_PENDING,
      };
    },
    [purchasePack.fulfilled]: (state, action) => {
      return {
        ...state,
        txInfo: action.payload.response,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: statusMessage.EXECUTE_MESSAGE_SUCCESS,
      };
    },
    [purchasePack.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: action.payload.response,
      };
    },
    [getPurchasePackResponse.pending]: (state) => {
      return {
        ...state,
      };
    },
    [getPurchasePackResponse.fulfilled]: (state, action) => {
      return {
        ...state,
        txResponse: action.payload.response,
        drawList: processRoundData(action.payload.drawList),
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: statusMessage.EXECUTE_MESSAGE_SUCCESS,
      };
    },
    [getPurchasePackResponse.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.EXECUTE,
        message: action.payload.response,
      };
    },
    [getPackPrice.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET,
      };
    },
    [getPackPrice.fulfilled]: (state, action) => {
      return {
        ...state,
        packPrice: action.payload.response,
        status: action.payload.status,
        action: actionType.GET,
      };
    },
    [getPackPrice.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.GET,
      };
    },
    [estimatePurchaseFee.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET,
      };
    },
    [estimatePurchaseFee.fulfilled]: (state, action) => {
      return {
        ...state,
        txFee: action.payload.response,
        status: action.payload.status,
        action: actionType.GET,
      };
    },
    [estimatePurchaseFee.rejected]: (state, action) => {
      return {
        ...state,
        message: action.payload.response,
        status: action.payload.status,
        action: actionType.GET,
      };
    },
    [getLastRound.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET,
      };
    },
    [getLastRound.fulfilled]: (state, action) => {
      return {
        ...state,
        latestRound: action.payload.response,
        status: action.payload.status,
        action: actionType.GET,
      };
    },
    [getLastRound.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.GET,
      };
    },
    [getRoundData.pending]: (state) => {
      return {
        ...state,
        status: statusCode.PENDING,
        action: actionType.GET,
      };
    },
    [getRoundData.fulfilled]: (state, action) => {
      return {
        ...state,
        drawList: processRoundData(action.payload.response),
        status: action.payload.status,
        action: actionType.GET,
      };
    },
    [getRoundData.rejected]: (state, action) => {
      return {
        ...state,
        status: action.payload.status,
        action: actionType.GET,
      };
    },
  },
});

export const { clearData } = packSlice.actions;
export default packSlice.reducer;
