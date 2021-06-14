import { shallow } from 'enzyme';
import TestUtils from '../utils';
import Button from '../../components/Button';

const { findByTestAttr } = TestUtils();

describe('Connect Button', () => {
  it('should render without error', () => {
    const wrapper = shallow(<Button/>);
    const component = findByTestAttr(wrapper, 'regular-button');

    expect(component.length).toBe(1);
  })

  it('should accept children as string display value', () => {
    const wrapper = shallow(<Button>Test Letter</Button>)
    const component = findByTestAttr(wrapper, 'regular-button');

    expect(component.text().length).not.toBe(0);
  });

  it('should show class of bg-red with `color props is red`', () => {
    const wrapper = shallow(<Button color="red">Test Letter</Button>)
    const component = findByTestAttr(wrapper, 'regular-button');

    expect(component.hasClass('bg-red')).toBe(true);
  });

  it('should show class of bg-red-100 with `color props is red and saturation props is 100`', () => {
    const wrapper = shallow(<Button color="red" saturation="100">Test Letter</Button>)
    const component = findByTestAttr(wrapper, 'regular-button');

    expect(component.hasClass('bg-red-100')).toBe(true);
  });

  it('should show class color for text color', () => {
    const wrapper = shallow(<Button text-color="red">Test Letter</Button>)
    const component = findByTestAttr(wrapper, 'regular-button');

    expect(component.hasClass('text-red')).toBe(true);
  });

  it('should show class color for text color and text saturation', () => {
    const wrapper = shallow(<Button text-color="red" text-saturation="100">Test Letter</Button>)
    const component = findByTestAttr(wrapper, 'regular-button');

    expect(component.hasClass('text-red-100')).toBe(true);
  });
})