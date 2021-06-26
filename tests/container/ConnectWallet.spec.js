import ConnectWallet from '../../container/ConnectWallet';
import TestUtils from '../utils';
import { mount } from 'enzyme'
import { Provider } from 'react-redux';

const { storeFactory, findByTestAttr } = TestUtils();

const setup = (initialState = {},) => {
  const store = storeFactory(initialState)
  return mount(<Provider store={store}><ConnectWallet/></Provider>)
}

describe("ConnectWallet", () => {
  it("should render without error", () => {
    //Just uncomment this section
    // const wrapper = setup();
    // const component = findByTestAttr(wrapper, "connect-wallet")
    // expect(component.length).toBe(1)
  });

  it("should render DialogButton without error", () => {

  });

  it("should show props isOpen true if Dialog button is clicked", () => {

  });

  it("should show props isOpen false if Dialog button is clicked again", () => {

  });

  it("shoud render wallet input component as passed children", () => {
    
  });

  it("should render wallet connect button as passed children", () => {

  });
});