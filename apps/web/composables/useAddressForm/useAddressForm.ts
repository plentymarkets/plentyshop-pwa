import { Address, AddressType, userAddressGetters } from "@plentymarkets/shop-api";
export const useAddressForm = (type: AddressType) => {

    const { saveAddress } = useAddress(type);

    const state = useState('useAddressForm' + type, () => ({
        isLoading: false,
        open: false,
        addressToSave: {},
        setFormAddress: {},
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

    /**
     * Check if the form is valid
     */
    const isValid = computed(() => {
        return state.value.onValidationEnd.validation.valid;
    });

    /**
     * Set the forms address
     * @param address 
     */
    const setAddress = (address: Address) => {
        const mappedAddress = {
            firstName: userAddressGetters.getFirstName(address),
            lastName: userAddressGetters.getLastName(address),
            phoneNumber: userAddressGetters.getPhone(address),
            country: userAddressGetters.getCountryId(address).toString() ?? '',
            streetName: userAddressGetters.getStreetName(address),
            apartment: userAddressGetters.getStreetNumber(address).toString() ?? '',
            city: userAddressGetters.getCity(address),
            state: userAddressGetters.getProvince(address),
            zipCode: userAddressGetters.getPostCode(address),
            primary: !userAddressGetters.getId(address)
        }
        state.value.setFormAddress = mappedAddress;
    }

    /**
     * Triggers the forms validation and saves the address if it is valid
     */
    const save = async () => {
        state.value.isLoading = true;
        state.value.onValidationStart = true;

        watch(() => state.value.onValidationEnd, async (value) => {
            state.value.onValidationStart = false;
            state.value.addressToSave = value.address;
            if (value.validation.valid) {
                await saveAddress(state.value.addressToSave as Address);
                state.value.open = false;
                state.value.isLoading = false;
            } else {
                state.value.isLoading = false;
            }
        }, { once: true })
    }


    return {
        save,
        setAddress,
        isValid,
        ...toRefs(state.value),
    }
};
