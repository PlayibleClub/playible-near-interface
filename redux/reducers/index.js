import { combineReducers } from 'redux';
import external from './external';
import contract from './contract';
import assets from './assets';

export default combineReducers({
  contract,
  external,
  assets,
});
