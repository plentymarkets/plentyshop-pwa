import { useCustomer } from '~/composables/useCustomer/useCustomer';

vi.mock('~/sdk', () => ({
  useSdk: () => ({
    commerce: {
      getCustomer: vi.fn(() => ({
        id: 'SfId',
        email: 'hieronim.anonim@gmail.com',
        firstName: 'hieronim',
        lastName: 'anonim'
      })),
    },
  }),
}));


describe('useCustomer', () => {
  it('should return account data', async () => {
    const { getSession, data } = useCustomer();

    await getSession();

    expect(data.value).not.toBeUndefined();
  });
});
