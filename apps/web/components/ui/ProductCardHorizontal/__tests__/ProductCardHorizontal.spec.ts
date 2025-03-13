import { mount } from '@vue/test-utils';
import { UiProductCardHorizontal } from '#components';

describe('<ProductCardHorizontal />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(UiProductCardHorizontal, {
      props: {
        product: {
          name: 'Smartwatch Fitness Tracker',
          gallery: [
            {
              alt: 'Smartwatch Fitness Tracker',
              url: '/images/watch.png',
            },
          ],
          attributes: [
            {
              label: 'Size',
              name: 'Size',
              value: '1.9″',
              valueLabel: 'value',
            },
            {
              name: 'Color',
              label: 'color',
              value: 'Black',
              valueLabel: 'value',
            },
          ],
        },
      },
    });

    expect(getByTestId('product-card-horizontal'));
  });
});
