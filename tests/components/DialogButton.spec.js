import { expect } from '@jest/globals';
import { shallow } from 'enzyme';
import TestUtils from '../utils';
import DialogButton from '../../components/DialogButton';

const { findByTestAttr, checkProps } = TestUtils();

const setup = () => {
  return shallow(<DialogButton/>)
}

// Appearance testing
describe("DialogButton", () => {
  it("should detect presence and then render without errors", () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'dialog')
    expect(component.length).toBe(1)
  });

  it("should show button for opening dialog", () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'dialog-button')
    expect(component.length).toBe(1)
  });

  it("should show dialog title", () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'dialog-title')
    expect(component.length).toBe(1);
  });

  it("should show dialog content container", () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'dialog-content-container')
    expect(component.length).toBe(1);
  })

  it("should show default close dialog button", () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'dialog-close-button')
    expect(component.length).toBe(1);
  })

  it("should show 3 transitions containers", () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'dialog-transitions')
    expect(component.length).toBe(2);
  })
  
  it("should render center tag placebo", () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'dialog-center-tag')
    expect(component.length).toBe(1);
  })
});

test('does not throw warning with expected props', () => {
  checkProps(DialogButton, {
    isOpen: 'false',
    onClose: () => {},
    title: "Sample Title",
    content: () => {},
    closeBtnTitle: "Close",
    onOpen: () => {},
    openBtnTitle: "Open"
  });
});