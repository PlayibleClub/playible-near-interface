/* eslint-disable import/no-extraneous-dependencies,
no-underscore-dangle, no-shadow,
import/prefer-default-export */

import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import rootReducer from './reducers';

export const middlewares = [ReduxThunk];

const enhancedMiddleware = applyMiddleware(...middlewares);

export const store = createStore(rootReducer, {}, composeWithDevTools(enhancedMiddleware));
