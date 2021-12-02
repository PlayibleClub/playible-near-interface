import { combineReducers } from 'redux';
import salesOrder from './salesOrder';
import assets from './assets';

export default combineReducers({
  salesOrder,
  assets
});
