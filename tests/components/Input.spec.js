import Input from '../../components/Input';
import TestUtils from '../utils';
import { mount } from 'enzyme';
import 'jsdom-global/register';

const { findByTestAttr } = TestUtils();

const defaultProps = {
  name: "",
  placeHolder: "",
  label: "",
  type: ""
};

const setup = (props = {}) => {
  const setupProps = {...defaultProps, ...props}
  return mount(<Input {...setupProps}/>)
}

describe.skip("Input", () => {
  describe("Text Type", () => {
    describe("testing appearance", () => {
      let wrapper;
      beforeEach(() => {
        wrapper = setup();
      });

      it("should render whithout error", () => {
        const component = findByTestAttr(wrapper, "input-text");
        expect(component.length).toBe(1);
      });
    
      it("should render pressence of error message container", () => {
        const component = findByTestAttr(wrapper, "error-container");
        expect(component.length).toBe(1);
      });
    
      it("should have label container", () => { 
        const component = findByTestAttr(wrapper, "label-container");
        expect(component.length).toBe(1);
      });
    })

    describe("testing functionality", () => {
      it.todo("should test this component on connected components")
    })
  })
});