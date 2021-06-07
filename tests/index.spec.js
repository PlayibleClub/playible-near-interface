import { shallow } from 'enzyme';
import Home from '../pages/index';

describe('Home Page', () => {
    it('should render without crashing', () => {
        const wrapper = shallow(<Home />);
        console.log(wrapper.debug());
        expect(wrapper.find('div')).toHaveLength(1);
    });
});
