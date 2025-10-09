import { mount } from '@vue/test-utils';
import { UiQuantitySelector } from '#components';

const value = 1;

describe('<QuantitySelector />', () => {
  it('should render component', () => {
    const wrapper = mount(UiQuantitySelector, {
      props: {
        value,
      },
    });
    expect(wrapper.getByTestId('quantity-selector'));
  });
});
