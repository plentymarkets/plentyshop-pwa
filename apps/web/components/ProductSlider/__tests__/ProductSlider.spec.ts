import { mount } from '@vue/test-utils';
import { ProductSlider } from '#components';

describe('<ProductSlider />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(ProductSlider, {
      props: {
        items: [],
      },
    });

    expect(getByTestId('product-slider'));
  });
});
