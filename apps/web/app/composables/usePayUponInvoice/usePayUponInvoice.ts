import { AddressType, cartGetters } from '@plentymarkets/shop-api';
import type { PhoneValidationResult } from '~/components/ui/TelephoneInput/types';

export const usePayUponInvoice = () => {
  const { data: cart } = useCart();
  const { checkoutAddress: billingAddress } = useCheckoutAddress(AddressType.Billing);
  const { getCountryIsoCode } = useAggregatedCountries();
  const initState = (): PayUponInvoiceState => ({
    loading: false,
    submitFirstTime: true,
    birthDate: '',
    validBirthDate: true,
    phoneWithPrefix: '',
    validPhone: true,
    phoneError: '',
    phoneNumber: '',
    phoneCountryCode: '',
    fraudNet: {
      merchantId: null,
      fraudId: null,
      pageId: 'checkout-page',
    },
  });

  const state = useState<PayUponInvoiceState>('usePayUponInvoice', initState);
  const resetState = () => Object.assign(state.value, initState());

  const currency = computed(() => cartGetters.getCurrency(cart.value) || useAppConfig().fallbackCurrency);
  const defaultCountry = computed(() =>
    billingAddress.value?.country ? getCountryIsoCode(billingAddress.value.country) : '',
  );

  const isDateValid = (): boolean => {
    const date = new Date(state.value.birthDate);
    return state.value.birthDate !== '' && !Number.isNaN(date.getTime()) && date < new Date();
  };

  const handlePhoneNumberValidation = (validation: PhoneValidationResult) => {
    state.value.validPhone = validation.valid;
    state.value.phoneNumber = validation.nationalNumber;
    state.value.phoneCountryCode = validation.countryCallingCode;
  };

  return {
    ...toRefs(state.value),
    resetState,
    currency,
    defaultCountry,
    isDateValid,
    handlePhoneNumberValidation,
  };
};
