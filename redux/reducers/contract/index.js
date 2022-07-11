import { combineReducers } from 'redux';
import pack from './pack';
import portfolio from './portfolio';
// import marketplace from './marketplace';
import nft from './nft';

export default combineReducers({
  pack,
  portfolio,
  nft,
});
