import { mount } from '@vue/test-utils';
import Badges from '~/components/ui/Badges/Badges.vue';
import { Product } from '@plentymarkets/shop-api';

describe('<Badges />', () => {
  it('should render component', () => {
    const wrapper = mount(Badges, {
      props: {
        product: {
          tags: [{ id: 1, names: { name: 'Tag', lang: 'en' } }],
        } as Product,
      },
    });

    expect(wrapper.getByTestId('badges'));
  });
});
