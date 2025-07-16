import { mount } from '@vue/test-utils';
import { UiProductCard } from '#components';
import { ProductMock } from '../../../../../__tests__/__mocks__/product.mock';

describe('<ProductCard />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(UiProductCard, {
      props: {
        product: ProductMock,
        name: 'test',
        price: 100,
        imageUrl: '/images/product.webp',
        imageWidth: 600,
        imageHeight: 600,
      },
    });

    expect(getByTestId('product-card'));
  });
});
