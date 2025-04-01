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

  // it('should call getPreferredProfiles and update preferredProfiles state', async () => {
  //   const { getPreferredProfiles, data } = usePreferredDelivery();
  //   useSdk().plentysystems.getPreferredDeliveryShippingProfiles = vi.fn().mockResolvedValue({
  //     data: {
  //       6: ['PreferredNeighbour', 'PreferredLocation', 'PreferredDay'],
  //     },
  //   });

  //   await getPreferredProfiles();

  //   expect(data.value.preferredProfiles).toEqual({
  //     6: ['PreferredNeighbour', 'PreferredLocation', 'PreferredDay'],
  //   });
  // });

  it('should call getPreferredDeliveryServices and update the state correctly', async () => {
    const { getPreferredDeliveryServices, data } = usePreferredDelivery();

    useSdk().plentysystems.getPreferredDeliveryServices = vi.fn().mockResolvedValue({
      data: {
        preferredLocation: true,
        preferredNeighbour: true,
        additionalCharge: 1.99,
        preferredDay: {
          '02-04-2025': { date: '2025-04-02', dayNumber: '02', dayName: 'Wednesday' },
          '03-04-2025': { date: '2025-04-03', dayNumber: '03', dayName: 'Thursday' },
          '04-04-2025': { date: '2025-04-04', dayNumber: '04', dayName: 'Friday' },
          '05-04-2025': { date: '2025-04-05', dayNumber: '05', dayName: 'Saturday' },
          '07-04-2025': { date: '2025-04-07', dayNumber: '07', dayName: 'Monday' },
          '08-04-2025': { date: '2025-04-08', dayNumber: '08', dayName: 'Tuesday' },
        },
      },
    });

    //   await getPreferredDeliveryServices();

    //   expect(data.value.additionalCharge).toBe(1.99);
    //   expect(data.value.preferredDays).toEqual([
    //     { date: '', dayNumber: '', dayName: 'None' },
    //     { date: '2025-04-02', dayNumber: '02', dayName: 'Wednesday' },
    //     { date: '2025-04-03', dayNumber: '03', dayName: 'Thursday' },
    //     { date: '2025-04-04', dayNumber: '04', dayName: 'Friday' },
    //     { date: '2025-04-05', dayNumber: '05', dayName: 'Saturday' },
    //     { date: '2025-04-07', dayNumber: '07', dayName: 'Monday' },
    //     { date: '2025-04-08', dayNumber: '08', dayName: 'Tuesday' },
    //   ]);
    //   expect(data.value.day.enabled).toBe(true);
    //   expect(data.value.location.enabled).toBe(true);
    //   expect(data.value.neighbour.enabled).toBe(true);
    // });

    // it('should handle day checkbox change correctly', () => {
    //   const { dayCheckboxChange, data } = usePreferredDelivery();
    //   data.value.day.checked = true;
    //   data.value.preferredDays = [{ date: '2025-04-02', dayNumber: '02', dayName: 'Wednesday' }];

    //   dayCheckboxChange();

    //   expect(data.value.day.value).toBe('2025-04-02');
    // });

    // it('should submit form with correct parameters', async () => {
    //   const { submitForm, data } = usePreferredDelivery();

    //   data.value.day.checked = true;
    //   data.value.day.value = '2025-04-02';
    //   data.value.location.checked = true;
    //   data.value.location.value = 'Location';
    //   data.value.neighbour.checked = true;
    //   data.value.neighbour.name = 'John Doe';
    //   data.value.neighbour.address = '123 Street';

    //   useSdk().plentysystems.doSavePreferredDeliveryServices = vi.fn().mockResolvedValue({});

    //   await submitForm();

    //   expect(useSdk().plentysystems.doSavePreferredDeliveryServices).toHaveBeenCalledWith({
    //     preferredDay: '2025-04-02',
    //     surcharge: '1.99',
    //     preferredLocation: 'Location',
    //     preferredNeighbourName: 'John Doe',
    //     preferredNeighbourAddress: '123 Street',
    //   });
  });
});
