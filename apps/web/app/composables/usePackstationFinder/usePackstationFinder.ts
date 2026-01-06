import type {
  PreferredDeliveryLocationShippingProfilesData,
  ApiError,
  PackstationList,
  PackstationsSearchParams,
} from '@plentymarkets/shop-api';
import { AddressType, shippingProviderGetters } from '@plentymarkets/shop-api';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';

export const usePackstationFinder = () => {
  const { $i18n } = useNuxtApp();
  const { countryHasDelivery } = useCheckoutAddress(AddressType.Shipping);
  const { data: cartData } = useCart();
  const genericMessage = $i18n.t('PreferredDelivery.packstation.noResult2');

  const state = useState('usePackstationFinder', () => ({
    loading: false,
    data: {
      preferredProfilesData: {} as PreferredDeliveryLocationShippingProfilesData,
      packstations: [] as PackstationList,
      searchParams: {
        street: '',
        zipcode: '',
        city: '',
        searchPackstation: true,
        searchPostfilial: true,
      } as PackstationsSearchParams,
    },
  }));

  const getShippingProfilesData = async () => {
    try {
      const { data } = await useSdk().plentysystems.getPreferredDeliveryLocationShippingProfiles();
      state.value.data.preferredProfilesData = data;
    } catch (error: unknown) {
      useHandleError(error as ApiError);
    }
  };

  const hasPreferredDeliveryLocation = computed(() => {
    const shippingProfileId = Number(shippingProviderGetters.getShippingProfileId(cartData.value));
    return state.value.data.preferredProfilesData.shippingProfiles?.includes(shippingProfileId) ?? false;
  });

  const deliveryLocationAvailable = computed(() => countryHasDelivery.value && hasPreferredDeliveryLocation.value);

  const conditionalField = (otherField1: string, otherField2: string) =>
    string().when([], {
      is: () =>
        !(
          state.value.data.searchParams[otherField1 as keyof typeof state.value.data.searchParams] ||
          state.value.data.searchParams[otherField2 as keyof typeof state.value.data.searchParams]
        ),
      then: () => string().required(genericMessage).min(3, genericMessage).default(''),
      otherwise: () => string().optional().default(''),
    });

  const validationSchema = toTypedSchema(
    object({
      searchParams: object({
        street: conditionalField('zipcode', 'city'),
        zipcode: conditionalField('street', 'city'),
        city: conditionalField('street', 'zipcode'),
      }),
    }),
  );

  const submitForm = async () => {
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.getPackstations(state.value.data.searchParams);
      state.value.data.packstations = data;
      state.value.loading = false;
    } catch (error: unknown) {
      useHandleError(error as ApiError);
      state.value.loading = false;
    }
  };

  const resetComponent = () => {
    state.value.data.searchParams = {
      street: '',
      zipcode: '',
      city: '',
      searchPackstation: true,
      searchPostfilial: true,
    } as PackstationsSearchParams;
  };

  return {
    getShippingProfilesData,
    hasPreferredDeliveryLocation,
    deliveryLocationAvailable,
    validationSchema,
    submitForm,
    resetComponent,
    ...toRefs(state.value),
  };
};
