import { Address, AddressType } from "@plentymarkets/shop-api";
import { createSharedComposable } from "@vueuse/core";
import { object, string, boolean, number } from 'yup';


export const useAddressFormShipping = createSharedComposable((address?: Address) => {

    const type = AddressType.Shipping;
    const { t } = useI18n();
    const validationSchema = toTypedSchema(
        object({
            form: object({
                firstName: string().required(t('errorMessages.requiredField')).default(''),
                lastName: string().required(t('errorMessages.requiredField')).default(''),
                phoneNumber: number().default(null),
                country: string().required(t('errorMessages.requiredField')).default(''),
                streetName: string().required(t('errorMessages.requiredField')).default(''),
                apartment: string().required(t('errorMessages.requiredField')).default(''),
                city: string().required(t('errorMessages.requiredField')).default(''),
                state: string().required(t('errorMessages.requiredField')).default(''),
                zipCode: string().required(t('errorMessages.requiredField')).default(''),
                primary: boolean().default(false),
            }),
        }
        ));

    const { meta, defineField, errors, values, resetForm, validate} = useForm({
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

    const data = useState('useAddressForm' + type, () => ({
        isLoading: false,
        open: true,
    }));

    const save = async () => {

        data.value.isLoading = true;

        validate();


        console.log(meta.value.valid);
        console.log(errors.value);
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
