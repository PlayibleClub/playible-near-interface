import { combineReducers } from 'redux';
import external from './external';
import contract from './contract';

export default combineReducers({
  contract,
  external
});
