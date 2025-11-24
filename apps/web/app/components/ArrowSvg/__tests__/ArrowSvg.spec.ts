import { mount } from '@vue/test-utils';
import ArrowSvg from '../ArrowSvg.vue';

describe('ArrowSvg', () => {
  const defaultProps = {
    level: 'A',
    _size: 'base',
  };

  it('renders correctly', () => {
    const wrapper = mount(ArrowSvg, {
      props: defaultProps,
    });

    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('accepts props correctly', () => {
    const wrapper = mount(ArrowSvg, {
      props: defaultProps,
    });

    expect(wrapper.props().level).toBe('A');
  });
});
