import { mount } from '@vue/test-utils';
import ProductCard from '~/components/ui/ProductCard/ProductCard.vue';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';

describe('<ProductCard />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(ProductCard, {
      props: {
        product: ProductMock,
        name: 'test',
        price: 100,
        imageUrl: '/images/product.webp'
      },
    });

    expect(getByTestId('product-card'));
  });
});
