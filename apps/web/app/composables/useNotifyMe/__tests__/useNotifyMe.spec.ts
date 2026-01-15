/* eslint-disable max-nested-callbacks */
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { ApiError } from '@plentymarkets/shop-api';

const mockDoSubscribeNotifyMe = vi.fn();
const mockDoConfirmNotifyMe = vi.fn();
const mockDoUnsubscribeNotifyMe = vi.fn();

const { useSdk, useHandleError } = vi.hoisted(() => ({
  useSdk: vi.fn(() => ({
    plentysystems: {
      doSubscribeNotifyMe: mockDoSubscribeNotifyMe,
      doConfirmNotifyMe: mockDoConfirmNotifyMe,
      doUnsubscribeNotifyMe: mockDoUnsubscribeNotifyMe,
    },
  })),
  useHandleError: vi.fn(),
}));

mockNuxtImport('useSdk', () => useSdk);
mockNuxtImport('useHandleError', () => useHandleError);

describe('useNotifyMe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('subscribe', () => {
    it('should successfully subscribe and manage loading state', async () => {
      const mockResponse = { success: true };
      mockDoSubscribeNotifyMe.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockResponse }), 50)),
      );

      const { subscribe, loading } = useNotifyMe();
      expect(loading.value).toBe(false);

      const promise = subscribe({
        email: 'test@example.com',
        variationId: 123,
        lang: 'de',
        'cf-turnstile-response': 'test-token',
      });
      expect(loading.value).toBe(true);

      const result = await promise;
      expect(result).toEqual(mockResponse);
      expect(loading.value).toBe(false);
    });

    it('should call useHandleError if doSubscribeNotifyMe throws', async () => {
      mockDoSubscribeNotifyMe.mockImplementation(() => {
        throw new ApiError({
          key: 'notification.error',
          code: '400',
          message: 'invalid params',
          cause: {},
        });
      });

      const { subscribe } = useNotifyMe();

      const result = await subscribe({
        email: 'invalid',
        variationId: -1,
        lang: 'de',
        'cf-turnstile-response': '',
      });

      expect(result).toBe(false);
      expect(useHandleError).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmNotifyMe', () => {
    it('should successfully confirm and manage loading state', async () => {
      const mockResponse = { success: true };
      mockDoConfirmNotifyMe.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockResponse }), 50)),
      );

      const { confirmNotifyMe, loading } = useNotifyMe();
      expect(loading.value).toBe(false);

      const promise = confirmNotifyMe({ token: 'token-mock' });
      expect(loading.value).toBe(true);

      const result = await promise;
      expect(result).toEqual(mockResponse);
      expect(loading.value).toBe(false);
    });
  });

  describe('unsubscribeNotifyMe', () => {
    it('should successfully unsubscribe and manage loading state', async () => {
      const mockResponse = { success: true };
      mockDoUnsubscribeNotifyMe.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockResponse }), 50)),
      );

      const { useNotifyMe } = await import('../useNotifyMe');
      const { unsubscribeNotifyMe, loading } = useNotifyMe();
      expect(loading.value).toBe(false);

      const promise = unsubscribeNotifyMe({ token: 'token-mock' });
      expect(loading.value).toBe(true);

      const result = await promise;
      expect(result).toEqual(mockResponse);
      expect(loading.value).toBe(false);
    });
  });
});
