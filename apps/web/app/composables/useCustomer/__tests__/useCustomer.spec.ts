import { useCustomer } from '~/composables/useCustomer/useCustomer';

describe('useCustomer', () => {
  it('should return account data after guest login', async () => {
    const { loginAsGuest, user } = useCustomer();

    await loginAsGuest('max.mustermann@plentyone.com');

    expect(user.value).not.toBeUndefined();
  });
});
