import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { useCustomer } = vi.hoisted(() => {
  return {
    useCustomer: vi.fn().mockReturnValue({
      register: vi.fn(),
      isAuthorized: { value: false },
    }),
  };
});

const { useNotification } = vi.hoisted(() => {
  return {
    useNotification: vi.fn().mockReturnValue({
      send: vi.fn(),
    }),
  };
});

const { useRuntimeConfig } = vi.hoisted(() => {
  return {
    useRuntimeConfig: vi.fn().mockReturnValue({
      public: {
        turnstileSiteKey: 'test-turnstile-key',
        passwordMinLength: 8,
        passwordMaxLength: 64,
      },
    }),
  };
});

const { useCart } = vi.hoisted(() => {
  return {
    useCart: vi.fn().mockReturnValue({
      data: { value: { shippingCountryId: 1 } },
    }),
  };
});

const { useAggregatedCountries } = vi.hoisted(() => {
  return {
    useAggregatedCountries: vi.fn().mockReturnValue({
      getCountryZipCodeRegex: vi.fn(() => null),
    }),
  };
});

const { useRouter } = vi.hoisted(() => {
  return {
    useRouter: vi.fn().mockReturnValue({
      currentRoute: { value: { query: {} } },
    }),
  };
});

const { useLocalePath } = vi.hoisted(() => {
  return {
    useLocalePath: vi.fn().mockReturnValue(vi.fn((path: string) => path)),
  };
});

const { navigateTo } = vi.hoisted(() => {
  return {
    navigateTo: vi.fn(),
  };
});

const { useNuxtApp } = vi.hoisted(() => {
  return {
    useNuxtApp: vi.fn().mockReturnValue({
      $i18n: {
        t: vi.fn((key: string) => key),
      },
    }),
  };
});

const { useState } = vi.hoisted(() => {
  return {
    useState: vi.fn((key: string, init?: () => unknown) => {
      const state = init ? init() : {};
      return { value: state };
    }),
  };
});

const { useSiteSettings } = vi.hoisted(() => {
  return {
    useSiteSettings: vi.fn().mockReturnValue({
      getSetting: vi.fn(() => 'test-turnstile-key'),
    }),
  };
});

mockNuxtImport('useCustomer', () => useCustomer);
mockNuxtImport('useNotification', () => useNotification);
mockNuxtImport('useRuntimeConfig', () => useRuntimeConfig);
mockNuxtImport('useCart', () => useCart);
mockNuxtImport('useAggregatedCountries', () => useAggregatedCountries);
mockNuxtImport('useRouter', () => useRouter);
mockNuxtImport('useLocalePath', () => useLocalePath);
mockNuxtImport('navigateTo', () => navigateTo);
mockNuxtImport('useNuxtApp', () => useNuxtApp);
mockNuxtImport('useState', () => useState);
mockNuxtImport('useSiteSettings', () => useSiteSettings);

describe('useRegisterForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    useNuxtApp.mockReturnValue({
      $i18n: { t: vi.fn((key: string) => key) },
    });

    useRuntimeConfig.mockReturnValue({
      public: {
        turnstileSiteKey: 'test-key',
        passwordMinLength: 8,
        passwordMaxLength: 64,
      },
    });

    useNotification.mockReturnValue({
      send: vi.fn(),
    });

    useCustomer.mockReturnValue({
      register: vi.fn(),
      isAuthorized: { value: false },
    });

    useCart.mockReturnValue({
      data: { value: { shippingCountryId: 1 } },
    });

    useAggregatedCountries.mockReturnValue({
      getCountryZipCodeRegex: vi.fn(() => null),
    });

    useRouter.mockReturnValue({
      currentRoute: { value: { query: {} } },
    });

    useLocalePath.mockReturnValue(vi.fn((path: string) => path));

    navigateTo.mockImplementation(vi.fn());

    useState.mockImplementation((key: string, init?: () => unknown) => {
      const state = init ? init() : {};
      return { value: state };
    });

    useSiteSettings.mockReturnValue({
      getSetting: vi.fn(() => 'test-turnstile-key'),
    });
  });

  it('should initialize composable with proper structure', async () => {
    const { useRegisterForm } = await import('../useRegisterForm');
    const composable = useRegisterForm();

    expect(composable.formFields).toBeDefined();
    expect(composable.formFieldsAttributes).toBeDefined();
    expect(composable.hasCompany).toBeDefined();
    expect(composable.onSubmit).toBeDefined();
    expect(composable.passwordValidationLength).toBeDefined();
    expect(composable.passwordValidationOneDigit).toBeDefined();
    expect(composable.passwordValidationOneLetter).toBeDefined();
  });

  it('should handle form submission', async () => {
    const mockRegister = vi.fn().mockResolvedValue({ data: { id: 123 } });
    const mockSend = vi.fn();

    useCustomer.mockReturnValue({
      register: mockRegister,
      isAuthorized: { value: false },
    });

    useNotification.mockReturnValue({
      send: mockSend,
    });

    const { useRegisterForm } = await import('../useRegisterForm');
    const composable = useRegisterForm();

    composable.formFields.email.value = 'test@example.com';
    composable.formFields.password.value = 'Password123';
    composable.formFields.repeatPassword.value = 'Password123';
    composable.formFields.firstName.value = 'John';
    composable.formFields.lastName.value = 'Doe';
    composable.formFields.streetName.value = 'Main Street';
    composable.formFields.apartment.value = '1A';
    composable.formFields.city.value = 'Test City';
    composable.formFields.zipCode.value = '12345';
    composable.formFields.country.value = '1';
    composable.formFields.privacyPolicy.value = true;
    composable.formFields.turnstile.value = 'token';

    await composable.onSubmit();

    expect(mockRegister).toHaveBeenCalled();
    expect(mockSend).toHaveBeenCalledWith({
      message: 'auth.signup.success',
      type: 'positive',
    });
  });
});
