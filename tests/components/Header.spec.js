import { shallow } from 'enzyme';
import Header from '../../components/Header';
import TestUtils from '../utils';

const { findByTestAttr } = TestUtils();

describe('Header', () => {
  it('should render without errors', () => {
    const wrapper = shallow(<Header />);
    const component = findByTestAttr(wrapper, 'header');
    expect(component.length).toBe(1);
  });

  it('should have children', () => {
    const wrapper = shallow(<Header><div>Fantasy Investar</div></Header>);
    const component = findByTestAttr(wrapper, 'header');
    //console.log(component.debug());
    expect(component.children().length).toBe(1);
  });

  it('should show class of bg-blue with `color props is blue`', () => {

    const wrapper = shallow(<Header color="blue"><div>Fantasy Investar</div></Header>);
    const component = findByTestAttr(wrapper, 'header');

    expect(component.hasClass('bg-blue-200')).toBe(true);
  });


})