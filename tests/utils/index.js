import { applyMiddleware, createStore } from "redux"
import { middlewares } from "../../redux/store"
import rootReducer from '../../redux/reducers/index';
import { checkPropTypes } from "prop-types";

const TestUtils = () => {
  const findByTestAttr = (wrapper, val) => {
    return wrapper.find(`[data-test="${val}"]`)
  }

  const storeFactory = (initialState) => {
    return createStore(rootReducer, initialState, applyMiddleware(...middlewares));
  }

  const checkProps = (component, conformingProps) => {
    const propError = checkPropTypes(
      component.propTypes,
      conformingProps, 
      'prop',
      component.name
    ) 

    expect(propError).toBeUndefined();
  }

  return { findByTestAttr, storeFactory, checkProps };
}

export default TestUtils;

