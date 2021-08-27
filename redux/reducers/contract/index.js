import { combineReducers } from 'redux';
import wallet from './wallet';
import pack from './pack';

export default combineReducers({
  wallet,
  pack
});
