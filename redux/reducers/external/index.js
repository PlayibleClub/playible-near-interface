import { combineReducers } from 'redux';
import fantasy from './fantasy';
import playible from './playible';

export default combineReducers({
  fantasy,
  playible
});
