import { Address, AddressType } from "@plentymarkets/shop-api";
export const useAddressFormBilling = (address?: Address) => {

    const type = AddressType.Billing;

    const { saveAddress } = useAddress(type);
    
    const state = useState('useAddressForm' + type, () => ({
        isLoading: false,
        open: true,
        address: {},
        onValidationStart: false,
        onValidationEnd: {
            address: {},
            validation: {
                valid: false,
                errors: {},
                results: {},
            },
        }
    }));

    const save = () => {
        state.value.isLoading = true;
        state.value.onValidationStart = true;

        watch(() => state.value.onValidationEnd, (value) => {
            state.value.onValidationStart = false;
            state.value.address = value.address;
            state.value.isLoading = false;

            if (value.validation.valid) {
                saveAddress(state.value.address as Address);
            }
        }, { once: true })
    }

    /* if (address) {
        data.value.form = ({
            firstName: userAddressGetters.getFirstName(address),
            lastName: userAddressGetters.getLastName(address),
            phoneNumber: userAddressGetters.getPhone(address),
            country: userAddressGetters.getCountryId(address).toString() ?? '',
            streetName: userAddressGetters.getStreetName(address),
            apartment: userAddressGetters.getStreetNumber(address).toString() ?? '',
            city: userAddressGetters.getCity(address),
            state: userAddressGetters.getProvince(address),
            zipCode: userAddressGetters.getPostCode(address),
            primary: !userAddressGetters.getId(address),
            swag: ''
        });
    } else {
        if (tryUseNuxtApp()) {
            const { $i18n } = useNuxtApp();
            const { locale } = $i18n;
            const defaultCountry = shippingCountries.value.find((country) => country.lang === locale);
            data.value.form.country = defaultCountry?.id.toString() ?? '';
        }
    } */


    return {
        save,
        ...toRefs(state.value),
    }
};
