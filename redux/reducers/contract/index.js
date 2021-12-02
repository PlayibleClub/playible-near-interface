import { combineReducers } from 'redux';
import wallet from './wallet';
import pack from './pack';
import portfolio from './portfolio';
import nft from './nft';

export default combineReducers({
  wallet,
  pack,
  portfolio,
  nft
});
