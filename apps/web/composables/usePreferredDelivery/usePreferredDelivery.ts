import {
  AddressType,
  cartGetters,
  shippingProviderGetters,
  type ApiError,
  type DoSavePreferredDeliveryServiceParams,
  type PreferredDeliveryServicesData,
  type PreferredDeliveryShippingProfilesData,
} from '@plentymarkets/shop-api';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';

export const usePreferredDelivery = () => {
  const { $i18n } = useNuxtApp();
  const { countryHasDelivery, checkoutAddress: shippingAddress } = useCheckoutAddress(AddressType.Shipping);
  const { data: cartData } = useCart();

  const state = useState('usePreferredDelivery', () => ({
    loading: false,
    data: {
      preferredProfiles: {} as PreferredDeliveryShippingProfilesData,
      preferredDays: [] as PreferredDay[],
      shippingAmountChanged: false,
      additionalCharge: null as number | null,
      day: {
        enabled: false,
        checked: false,
        value: '',
      } as PreferredOption,
      location: {
        enabled: false,
        checked: false,
        value: '',
      } as PreferredOption,
      neighbour: {
        enabled: false,
        checked: false,
        name: '',
        address: '',
      } as NeighbourOption,
    },
  }));

  const validationSchema = toTypedSchema(
    object({
      location: object({
        value: string().when([], {
          is: () => state.value.data.location.checked,
          then: () => string().required($i18n.t('PreferredDelivery.general.preferredLocationAlertMessage')).default(''),
          otherwise: () => string().optional().default(''),
        }),
      }),
      neighbour: object({
        name: string().when([], {
          is: () => state.value.data.neighbour.checked,
          then: () =>
            string()
              .required($i18n.t('PreferredDelivery.general.preferredNeighbourNameAlertMessage'))
              .test(
                'is-valid-neighbour-name',
                $i18n.t('PreferredDelivery.general.preferredNeigbourMaxCharViolation'),
                (name: string) => name.length <= 100,
              )
              .default(''),
          otherwise: () => string().optional().default(''),
        }),
        address: string().when([], {
          is: () => state.value.data.neighbour.checked,
          then: () =>
            string()
              .required($i18n.t('PreferredDelivery.general.preferredNeighbourAddressMessage'))
              .test(
                'is-valid-neighbour-address',
                $i18n.t('PreferredDelivery.general.preferredNeigbourMaxCharViolation'),
                (address: string) => address.length <= 100,
              )
              .default(''),
          otherwise: () => string().optional().default(''),
        }),
      }),
    }),
  );

  const dayCheckboxChange = () => {
    if (!state.value.data.day.checked) {
      state.value.data.day.value = '';
      return;
    }

    state.value.data.day.value = state.value.data.preferredDays.find((day) => day.date)?.date ?? '';
  };

  const shippingMethodHasPreferredDelivery = computed(() => {
    const shippingProfileId = Number(shippingProviderGetters.getShippingProfileId(cartData.value));
    return shippingProfileId in state.value.data.preferredProfiles;
  });

  const preferredDeliveryAvailable = computed(
    () =>
      countryHasDelivery.value &&
      shippingMethodHasPreferredDelivery.value &&
      (state.value.data.day.enabled || state.value.data.location.enabled || state.value.data.neighbour.enabled),
  );

  const getPreferredProfiles = async () => {
    try {
      const { data } = await useSdk().plentysystems.getPreferredDeliveryShippingProfiles();
      state.value.data.preferredProfiles = data;
    } catch (error: unknown) {
      useHandleError(error as ApiError);
    }
  };

  const getPreferredDeliveryServices = async () => {
    const shippingProfileId = Number(shippingProviderGetters.getShippingProfileId(cartData.value));

    try {
      const { data } = await useSdk().plentysystems.getPreferredDeliveryServices({
        shippingProfileId: shippingProfileId,
        postalcode: shippingAddress.value.zipCode,
      });

      state.value.data.additionalCharge = data.additionalCharge;

      if (typeof data.preferredDay !== 'boolean') {
        state.value.data.preferredDays = [
          {
            date: '',
            dayNumber: '',
            dayName: $i18n.t('PreferredDelivery.general.wunschtagNone'),
          },
          ...Object.values(data.preferredDay),
        ];
      }

      propagateEnabledOptions(shippingProfileId, data);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.log(error?.toString());

      useNotification().send({
        type: 'negative',
        message: $i18n.t('PreferredDelivery.general.invalidPostalCodeMessage'),
      });
    }
  };

  const propagateEnabledOptions = (shippingProfileId: number, data: PreferredDeliveryServicesData) => {
    const preferredIdProfile = state.value.data.preferredProfiles[shippingProfileId];
    if (!preferredIdProfile) return;

    state.value.data.day.enabled =
      preferredIdProfile?.includes('PreferredDay') && typeof data.preferredDay !== 'boolean';

    state.value.data.location.enabled =
      preferredIdProfile?.includes('PreferredLocation') && data.preferredLocation === true;

    state.value.data.neighbour.enabled =
      preferredIdProfile?.includes('PreferredNeighbour') && data.preferredNeighbour === true;
  };

  const disableAllOptions = () => {
    if (Object.keys(state.value.data.preferredProfiles).length) {
      state.value.data.day.enabled = false;
      state.value.data.location.enabled = false;
      state.value.data.neighbour.enabled = false;
    }
  };

  const handleDayChange = (dayIndex: number) => {
    const selectedDay = state.value.data.preferredDays[dayIndex];

    state.value.data.day.checked = !selectedDay || dayIndex === 0 ? false : true;
    state.value.data.day.value = !selectedDay || dayIndex === 0 ? '' : selectedDay.date;
  };

  const isDayChecked = (dayIndex: number) => {
    const selectedDay = state.value.data.preferredDays[dayIndex];
    return selectedDay && selectedDay.date === state.value.data.day.value;
  };

  const usingPreferredDay = computed(() => state.value.data.day.enabled && state.value.data.day.checked);

  const usingPreferredLocation = computed(() => state.value.data.location.enabled && state.value.data.location.checked);

  const usingPreferredNeighbour = computed(
    () => state.value.data.neighbour.enabled && state.value.data.neighbour.checked,
  );

  const currency = computed(
    () => cartGetters.getCurrency(cartData.value) || (useAppConfig().fallbackCurrency as string),
  );

  const submitForm = async () => {
    const parameters = {} as DoSavePreferredDeliveryServiceParams;

    if (usingPreferredDay.value) {
      parameters.preferredDay = state.value.data.day.value;
      if (state.value.data.additionalCharge) parameters.surcharge = state.value.data.additionalCharge;
    }

    if (usingPreferredLocation.value) {
      parameters.preferredLocation = state.value.data.location.value;
    }

    if (usingPreferredNeighbour.value) {
      parameters.preferredNeighbourName = state.value.data.neighbour.name;
      parameters.preferredNeighbourAddress = state.value.data.neighbour.address;
    }

    try {
      await useSdk().plentysystems.doSavePreferredDeliveryServices(parameters);
      useNotification().send({
        type: 'positive',
        message: $i18n.t('PreferredDelivery.general.submitWunschpaketServices'),
      });
    } catch (error: unknown) {
      useHandleError(error as ApiError);
    }

    if (state.value.data.shippingAmountChanged !== state.value.data.day.checked) {
      await useCartTotalChange().handleCartTotalChanges();
      state.value.data.shippingAmountChanged = state.value.data.day.checked;
    }
  };

  return {
    validationSchema,
    dayCheckboxChange,
    shippingMethodHasPreferredDelivery,
    preferredDeliveryAvailable,
    getPreferredProfiles,
    getPreferredDeliveryServices,
    disableAllOptions,
    handleDayChange,
    isDayChecked,
    currency,
    submitForm,
    ...toRefs(state.value),
  };
};
