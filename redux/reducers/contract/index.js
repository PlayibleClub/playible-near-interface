import { combineReducers } from 'redux';
import wallet from './wallet';
import pack from './pack';
import portfolio from './portfolio';

export default combineReducers({
  wallet,
  pack,
  portfolio
});
