import { shallow } from 'enzyme';
import {Header} from '../../components/Header';
import TestUtils from '../utils';

const { findByTestAttr } = TestUtils();

describe('Header', () => {
  it('should render without errors', () => {
    const wrapper = shallow(<Header/>);
    const component = findByTestAttr(wrapper, 'header');

    expect(component.length).toBe(1);
  })
})