import { mount } from '@vue/test-utils';
import ProductCard from '~/components/ui/ProductCard/ProductCard.vue';
import type { Product } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

describe('<ProductCard />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(ProductCard, {
      props: {
        product: {} as Product,
        name: 'test',
        price: 100,
        imageUrl: '/images/product.webp',
      },
    });

    expect(getByTestId('product-card'));
  });
});
