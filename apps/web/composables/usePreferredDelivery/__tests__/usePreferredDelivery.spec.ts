import { PreferredProfilesMock } from '../../../__tests__/__mocks__/preferred-profiles.mock';
import { PreferredDeliveryServicesMock } from '../../../__tests__/__mocks__/preferred-delivery-services.mock';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { useSdk } = vi.hoisted(() => {
  return {
    useSdk: vi.fn().mockReturnValue({
      plentysystems: {},
    }),
  };
});

mockNuxtImport('useSdk', () => useSdk);

describe('usePreferredDelivery', () => {
  afterEach(() => {
    clearNuxtState();
    vi.resetAllMocks();
  });

  it('should initialize with default state', () => {
    const { data } = usePreferredDelivery();
    expect(data.value.preferredProfiles).toEqual({});
    expect(data.value.preferredDays).toEqual([]);
    expect(data.value.additionalCharge).toBeNull();
    expect(data.value.day).toEqual({ enabled: false, checked: false, value: '' });
    expect(data.value.location).toEqual({ enabled: false, checked: false, value: '' });
    expect(data.value.neighbour).toEqual({
      enabled: false,
      checked: false,
      name: '',
      address: '',
    });
  });

  it('should disable all options when called', () => {
    const { disableAllOptions, data } = usePreferredDelivery();
    disableAllOptions();
    expect(data.value.day.enabled).toBe(false);
    expect(data.value.location.enabled).toBe(false);
    expect(data.value.neighbour.enabled).toBe(false);
  });

  it('should call getPreferredProfiles and update preferredProfiles state', async () => {
    useSdk.mockImplementation(() => {
      return {
        plentysystems: {
          getPreferredDeliveryShippingProfiles: vi.fn().mockResolvedValue({ data: PreferredProfilesMock }),
        },
      };
    });

    const { getPreferredProfiles, data } = usePreferredDelivery();
    await getPreferredProfiles();

    expect(data.value.preferredProfiles).toEqual(PreferredProfilesMock);
  });

  it('should call getPreferredDeliveryServices and update the state correctly', async () => {
    useSdk.mockImplementation(() => {
      return {
        plentysystems: {
          getPreferredDeliveryServices: vi.fn().mockResolvedValue({ data: PreferredDeliveryServicesMock }),
        },
      };
    });

    const { getPreferredDeliveryServices, data } = usePreferredDelivery();

    await getPreferredDeliveryServices();

    expect(data.value.additionalCharge).toEqual(expect.any(Number));
    expect(data.value.preferredDays).toEqual([
      { date: '', dayNumber: '', dayName: 'None' },
      ...Object.values(PreferredDeliveryServicesMock.preferredDay || {}),
    ]);
    expect(typeof data.value.day.enabled).toBe('boolean');
    expect(typeof data.value.location.enabled).toBe('boolean');
    expect(typeof data.value.neighbour.enabled).toBe('boolean');
  });

  it('should handle day checkbox change correctly', () => {
    const { dayCheckboxChange, data } = usePreferredDelivery();
    data.value.day.checked = true;
    data.value.preferredDays = [{ date: '2025-04-02', dayNumber: '02', dayName: 'Wednesday' }];

    dayCheckboxChange();

    expect(data.value.day.value).toBe('2025-04-02');
  });
});
