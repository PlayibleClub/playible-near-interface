import { combineReducers } from 'redux';
import external from './external';
import contract from './contract';
import assets from './external/playible/assets';

export default combineReducers({
  contract,
  external,
  assets,
});
