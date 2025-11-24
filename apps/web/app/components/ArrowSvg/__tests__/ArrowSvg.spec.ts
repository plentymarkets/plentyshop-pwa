import { mount } from '@vue/test-utils';
import ArrowSvg from '../ArrowSvg.vue';
import { sign } from 'crypto';
import { _size } from '#tailwind-config/theme';

describe('ArrowSvg', () => {
  const defaultProps = {
    level: 'A', // <-- hier unbedingt setzen, sonst TS meckert
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
