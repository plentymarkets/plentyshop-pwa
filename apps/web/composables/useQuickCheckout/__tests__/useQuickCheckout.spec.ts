import { useQuickCheckout } from '../useQuickCheckout';
import { ProductMock } from '../../../__tests__/__mocks__/product.mock';

describe('useQuickCheckout', () => {
  it('should check if open is true', () => {
    const { openQuickCheckout, isOpen } = useQuickCheckout();
    openQuickCheckout(ProductMock, 3);
    expect(isOpen.value).toBe(true);
  });

  it('should return product that was added', () => {
    const { openQuickCheckout, product } = useQuickCheckout();
    openQuickCheckout(ProductMock, 3);
    expect(product.value).toStrictEqual(ProductMock);
  });

  it('should check if quantity is being set', () => {
    const { openQuickCheckout, quantity } = useQuickCheckout();
    openQuickCheckout(ProductMock, 3);
    expect(quantity.value).toBe(3);
  });
});
