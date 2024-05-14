import { useQuickCheckout } from '../useQuickCheckout';
import { ProductMock } from '../../../__tests__/__mocks__/product.mock';

describe('useQuickCheckout', () => {
  it('should render component', () => {
    const { openQuickCheckout, quantity, isOpen } = useQuickCheckout();
    openQuickCheckout(ProductMock, 3);
    expect(isOpen).toBe(true);
  });
});
