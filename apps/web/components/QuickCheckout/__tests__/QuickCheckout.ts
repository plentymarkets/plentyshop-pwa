import { mount } from '@vue/test-utils';
import { QuickCheckout } from '#components';
import { ProductMock } from '../../../__tests__/__mocks__/product.mock';

describe('<QuickCheckout />', () => {
  it('should render component', () => {

    const { openQuickCheckout } = useQuickCheckout();
    openQuickCheckout(ProductMock, 3);

    const { getByTestId } = mount(QuickCheckout, {
      props: {
        product: ProductMock,
      },
    });
    expect(getByTestId('product-name'));

    const { quantity } = useQuickCheckout();
    expect(quantity).toBe(3);
  });
});
