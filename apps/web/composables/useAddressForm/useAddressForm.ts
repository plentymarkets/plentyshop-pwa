import { Address, AddressType, userAddressGetters } from "@plentymarkets/shop-api";

export const useAddressForm = async (type: AddressType, address?: Address) => {

    const defaultValues = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        country: '',
        streetName: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        primary: false
    }

    const state = useState('useAddressForm', () => ({
        isLoading: false,
        form: defaultValues,
    }));

    const { data: shippingCountries, getActiveShippingCountries } = useActiveShippingCountries();

    if (!shippingCountries.value.length) {
        state.value.isLoading = true;
        await getActiveShippingCountries();
        state.value.isLoading = false;
    }


    if (tryUseNuxtApp()) {
        const { $i18n } = useNuxtApp();
        const { locale } = $i18n;
        const defaultCountry = shippingCountries.value.find((country) => country.lang === locale);
        state.value.form.country = defaultCountry?.id.toString() ?? '';
    }

    const states = computed(() => {
        const selectedCountry = state.value.form.country;
        return shippingCountries.value.find((country) => country.id === Number(selectedCountry))?.states ?? [];
    });



    if (address) {
        state.value.form = ({
            firstName: userAddressGetters.getFirstName(address),
            lastName: userAddressGetters.getLastName(address),
            phoneNumber: userAddressGetters.getPhone(address),
            country: userAddressGetters.getCountryId(address).toString() ??'',
            streetName: userAddressGetters.getStreetName(address),
            apartment: userAddressGetters.getStreetNumber(address).toString() ?? '',
            city: userAddressGetters.getCity(address),
            state: userAddressGetters.getProvince(address),
            zipCode: userAddressGetters.getPostCode(address),
            primary: !userAddressGetters.getId(address),
        });
    }

    const reset = () => {
        state.value.form = defaultValues;
    }


    return {
        reset,
        ...toRefs(state.value),
        states,
        shippingCountries
    }


}
