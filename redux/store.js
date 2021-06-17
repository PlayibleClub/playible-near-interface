/* eslint-disable import/no-extraneous-dependencies,
no-underscore-dangle, no-shadow,
import/prefer-default-export */

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import rootReducer from './reducers';

const composeEnhancers = composeWithDevTools({
  realtime: true,
  name: 'Investar Redux',
  hostname: 'localhost',
  port: 8000,
});

const enhancedMiddleware = composeEnhancers(applyMiddleware(thunkMiddleWare));

export const store = createStore(rootReducer, enhancedMiddleware);
