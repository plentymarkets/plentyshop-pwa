import { Address, AddressType } from "@plentymarkets/shop-api";
import { OnValidationEnd } from "./types";

export const useAddressForm = (type: AddressType) => {

    const { saveAddress } = useAddress(type);

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

    const saveShippingAndBilling = () => {
        return save(true);
    }

    /**
     * Triggers the forms validation and saves the address if it is valid
     */
    const save = async (combineShippingAndBilling: boolean = false): Promise<Boolean> => {
        state.value.isLoading = true;
        emitValidationStart();

        return new Promise((resolve, reject) => {
            watch(() => state.value.onValidationEnd, async (value) => {
                state.value.onValidationStart = false;
                state.value.addressToSave = value.address;

                if (value.validation.valid) {
                    await saveAddress(state.value.addressToSave as Address, combineShippingAndBilling);
                    state.value.open = false;
                    state.value.isLoading = false;
                    resolve(true);
                } else {
                    state.value.isLoading = false;
                    reject(false);
                }
            }, { once: true });
        });
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
