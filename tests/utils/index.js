const TestUtils = () => {
   const findByTestAttr = (wrapper, val) => {
    return wrapper.find(`[data-test="${val}"]`)
  }

  return {findByTestAttr};
}

export default TestUtils;

