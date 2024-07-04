import { Address, AddressType, userAddressGetters } from "@plentymarkets/shop-api";
import { createSharedComposable } from "@vueuse/core";
import { object, string, boolean } from 'yup';



export const useAddressForm = createSharedComposable((type: AddressType, address?: Address) => {
    const data = useState('useAddressForm' + type, () => ({
        isLoading: false,
        open: true,
    }));

    const validationSchema = toTypedSchema(
        object({
            form: object({
                firstName: string().required('errorMessages.firstName.required').default(''),
                lastName: string().required('errorMessages.lastName.required').default(''),
                phoneNumber: string().required('errorMessages.phoneNumber.required').default(''),
                country: string().required('errorMessages.country.required').default(''),
                streetName: string().required('errorMessages.streetName.required').default(''),
                apartment: string().required('errorMessages.apartment.required').default(''),
                city: string().required('errorMessages.city.required').default(''),
                state: string().required('errorMessages.state.required').default(''),
                zipCode: string().required('errorMessages.zipCode.required').default(''),
                primary: boolean().default(false),
            }),
        }
        ));

    const { meta, defineField, errors, values, resetForm, validate } = useForm({
        validationSchema: validationSchema,
    });

    const [firstName, firstNameAttribures] = defineField('form.firstName');
    const [lastName, lastNameAttribures] = defineField('form.lastName');
    const [phoneNumber, phoneNumberAttribures] = defineField('form.phoneNumber');
    const [country, countryAttribures] = defineField('form.country');
    const [streetName, streetNameAttribures] = defineField('form.streetName');
    const [apartment, apartmentAttribures] = defineField('form.apartment');
    const [city, cityAttribures] = defineField('form.city');
    const [state, stateAttribures] = defineField('form.state');
    const [zipCode, zipCodeAttribures] = defineField('form.zipCode');

    const save = async () => {

        data.value.isLoading = true;

        validate();


        console.log(meta.value.valid);
        console.log(values.form);

        data.value.isLoading = false;

        /* await saveAddress(state.value.form);
        state.value.isLoading = false;
        state.value.open = false; */
    }


    const { data: shippingCountries } = useActiveShippingCountries();
    const { saveAddress } = useAddress(type);

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

    const states = computed(() => {
        const selectedCountry = values.form?.country;
        return shippingCountries.value.find((country) => country.id === Number(selectedCountry))?.states ?? [];
    });

    const reset = () => {
        resetForm();
    }

    return {

        form: ref({ firstName, lastName, phoneNumber, country, streetName, apartment, city, state, zipCode }),
        attributes: ref({ firstNameAttribures, lastNameAttribures, phoneNumberAttribures, countryAttribures, streetNameAttribures, apartmentAttribures, cityAttribures, stateAttribures, zipCodeAttribures }),
        errors,
        save,
        reset,
        ...toRefs(data.value),
        states,
        shippingCountries
    }
});
