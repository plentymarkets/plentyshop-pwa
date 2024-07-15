import { Address, AddressType } from "@plentymarkets/shop-api";
import { OnValidationEnd } from "./types";
export const useAddressForm = (type: AddressType) => {

    const { saveAddress, setCheckoutAddress} = useAddress(type);

    const state = useState('useAddressForm' + type, () => ({
        isLoading: false,
        open: false,
        addressToSave: {},
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

    const saveShippingAndBilling = async () => {

        state.value.isLoading = true;
        emitValidationStart();

        watch(() => state.value.onValidationEnd, async (value) => {
            state.value.onValidationStart = false;
            state.value.addressToSave = value.address;
            if (value.validation.valid) {
                const addresses = await saveAddress(state.value.addressToSave as Address);
                console.log('data', addresses);
                if (addresses[0].id){
                    setCheckoutAddress(AddressType.Billing, addresses[0].id );
                }
                state.value.open = false;
                state.value.isLoading = false;
            } else {
                state.value.isLoading = false;
            }
        }, { once: true })
    }

    /**
     * Triggers the forms validation and saves the address if it is valid
     */
    const save = async () => {
        state.value.isLoading = true;
        emitValidationStart();

        watch(() => state.value.onValidationEnd, async (value) => {
            state.value.onValidationStart = false;
            state.value.addressToSave = value.address;
            console.log('value', value);
            if (value.validation.valid) {
                await saveAddress(state.value.addressToSave as Address);
                state.value.open = false;
                state.value.isLoading = false;
            } else {
                state.value.isLoading = false;
            }
        }, { once: true })
    }

    const emitValidationStart = () => {
        state.value.onValidationStart = true;
    }

    const emitValidationEnd = (onValidationEnd: OnValidationEnd) => {
        state.value.onValidationEnd = onValidationEnd;
    }


    return {
        emitValidationStart,
        emitValidationEnd,
        save,
        saveShippingAndBilling,
        isValid,
        ...toRefs(state.value),
    }
};
