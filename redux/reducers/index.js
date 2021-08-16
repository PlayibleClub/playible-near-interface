import { combineReducers } from 'redux';
import wallet from './walletReducer';
import player from './player';

export default combineReducers({
  wallet,
  player
});
