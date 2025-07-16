import { useCustomerOrder } from '~/composables/useCustomerOrder/useCustomerOrder';

describe('useCustomerOrder', () => {
  it('should return customer order data', async () => {
    const { fetchOrder, data } = useCustomerOrder('1');

    await fetchOrder({
      orderId: '1',
    });

    expect(data.value).not.toBeUndefined();
  });
});
