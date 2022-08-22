import { combineReducers } from 'redux';
import external from 'redux/reducers/external';
import assets from 'redux/reducers/assets';

export default combineReducers({
  external,
  assets,
});
