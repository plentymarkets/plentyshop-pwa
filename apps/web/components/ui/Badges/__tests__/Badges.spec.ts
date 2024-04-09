import { mount } from '@vue/test-utils';
import { UiBadges } from '#components';
import type { Product } from '@plentymarkets/shop-api';

describe('<Badges />', () => {
  it('should render component', () => {
    const wrapper = mount(UiBadges, {
      props: {
        product: {
          tags: [{ id: 1, names: { name: 'Tag', lang: 'en' } }],
        } as Product,
      },
    });

    expect(wrapper.getByTestId('badges'));
  });
});
