import { AddressType } from "@plentymarkets/shop-api";

describe('useAddressForm', () => {

    it('should trigger onValidationStart event when saving', () => {
        const { onValidationStart, save } = useAddressForm(AddressType.Billing);
        save();
        expect(onValidationStart.value).toBe(true);
    });

    it('should reset onValidationStart event after saving', async () => {
        const { onValidationStart, onValidationEnd, save } = useAddressForm(AddressType.Billing);

        save();
        onValidationEnd.value = {
            address: {},
            validation: {
                valid: true,
                errors: {},
                results: {},
            }
        }
        await nextTick();
        expect(onValidationStart.value).toBe(false);
    });

    it('should get isValid state', () => {
        const { isValid, onValidationEnd } = useAddressForm(AddressType.Billing);

        onValidationEnd.value = {
            address: {},
            validation: {
                valid: true,
                errors: {},
                results: {},
            }
        }
        
        expect(isValid.value).toBe(true);
    })

    it('should set the forms address', () => {
        const { setAddress, setFormAddress } = useAddressForm(AddressType.Billing);
        const address = {
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '123456789',
            country: '1',
            streetName: 'Main St',
            apartment: '123',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            primary: true
        };
        setAddress(address);
        expect(setFormAddress.value).toEqual({
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '123456789',
            country: '1',
            streetName: 'Main St',
            apartment: '123',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            primary: true
        });
    });
});