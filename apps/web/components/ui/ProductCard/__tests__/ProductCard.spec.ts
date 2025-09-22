import { mount } from '@vue/test-utils';
import { UiProductCard } from '#components';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';

describe('<ProductCard />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(UiProductCard, {
      props: {
        product: ProductMock,
      },
    });

    expect(getByTestId('product-card'));
  });
});
