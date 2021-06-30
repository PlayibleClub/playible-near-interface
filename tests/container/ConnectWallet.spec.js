import ConnectWallet from '../../container/ConnectWallet';
import TestUtils from '../utils';
import { mount } from 'enzyme'
import { Provider } from 'react-redux';
import 'jsdom-global/register';

const { storeFactory, findByTestAttr } = TestUtils();

const setup = (initialState = {},) => {
  const store = storeFactory(initialState)
  return mount(<Provider store={store}><ConnectWallet/></Provider>)
}

describe.skip("ConnectWallet", () => {
  let wrapper
  beforeEach(() => {
    wrapper = setup();
  })
  
  it("should render without error", () => {
    const component = findByTestAttr(wrapper, "connect-wallet")
    expect(component.length).toBe(1);
  });

  it("should render DialogButton without error", () => {
    const component = findByTestAttr(wrapper, "dialog")
    expect(component.exists).toBe(true);
  });

  it("shoud render wallet input component as passed children", () => {
    const component = findByTestAttr(wrapper, "input-wallet");
    expect(component.exists()).toBe(true);
  });

  it("should render wallet connect button as passed children", () => {
    const component = findByTestAttr(wrapper, "connect-wallet-btn");
    expect(component.exists()).toBe(true);
  });
});
