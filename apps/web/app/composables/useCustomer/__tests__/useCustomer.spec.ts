import { useCustomer } from '~/composables/useCustomer/useCustomer';

describe('useCustomer', () => {
  it('should return account data', async () => {
    const { getSession, data } = useCustomer();

    await getSession();

    expect(data.value).not.toBeUndefined();
  });
});
