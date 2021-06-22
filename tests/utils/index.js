import { applyMiddleware, createStore } from "redux"
import { middlewares } from "../../redux/store"
import rootReducer from '../../redux/reducers/index';

const TestUtils = () => {
  const findByTestAttr = (wrapper, val) => {
    return wrapper.find(`[data-test="${val}"]`)
  }

  const storeFactory = (initialState) => {
    return createStore(rootReducer, initialState, applyMiddleware(...middlewares));
  }

  return { findByTestAttr, storeFactory };
}

export default TestUtils;

