import { shallow } from 'enzyme';
import Home from '../pages/index';

describe('Home Page', () => {
  it.skip('should render without crashing', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find('div')).toHaveLength(1);
  });
});
