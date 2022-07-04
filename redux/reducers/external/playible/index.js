import { combineReducers } from 'redux';
import salesOrder from './salesOrder';
import wallet from './wallet'

export default combineReducers({
  salesOrder,
  wallet
});
