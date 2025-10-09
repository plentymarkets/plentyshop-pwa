import { userGetters, cartGetters, type Address, AddressType } from '@plentymarkets/shop-api';
import { toTypedSchema } from '@vee-validate/yup';
import { boolean, object, string } from 'yup';
import { useForm } from 'vee-validate';
import type { UseRegisterFormReturn } from './types';

export const useRegisterForm = (): UseRegisterFormReturn => {
  const { $i18n } = useNuxtApp();
  const { send } = useNotification();
  const { data: cartData } = useCart();
  const { getCountryZipCodeRegex } = useAggregatedCountries();
  const { register, isAuthorized } = useCustomer();
  const router = useRouter();
  const localePath = useLocalePath();
  const { getSetting } = useSiteSettings('cloudflareTurnstileApiSiteKey');
  const turnstileSiteKey = getSetting() ?? '';
  const runtimeConfig = useRuntimeConfig();
  const passwordMinLength = runtimeConfig.public.passwordMinLength;
  const passwordMaxLength = runtimeConfig.public.passwordMaxLength;

  const state = useState('useRegisterForm', () => ({
    isLoading: false,
    hasCompany: false,
    invalidVAT: false,
    turnstileElement: null as { reset?: () => void } | null,
    defaultFormValues: {
      email: '',
      password: '',
      repeatPassword: '',
      firstName: '',
      lastName: '',
      companyName: '',
      vatNumber: '',
      streetName: '',
      apartment: '',
      city: '',
      zipCode: '',
      country: '',
      privacyPolicy: false,
      turnstile: '',
    },
  }));

  const validationSchema = toTypedSchema(
    object({
      email: string()
        .trim()
        .required($i18n.t('errorMessages.email.required'))
        .test('is-valid-email', $i18n.t('errorMessages.email.valid'), (mail: string) =>
          userGetters.isValidEmailAddress(mail),
        )
        .default(state.value.defaultFormValues.email),
      password: string()
        .required($i18n.t('errorMessages.password.required'))
        .transform((value) => (value ? value.replace(/\s/g, '') : value))
        .min(passwordMinLength, $i18n.t('errorMessages.password.minLength', { min: passwordMinLength }))
        .max(passwordMaxLength, $i18n.t('errorMessages.password.maxLength', { max: passwordMaxLength }))
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/, $i18n.t('errorMessages.password.valid'))
        .default(state.value.defaultFormValues.password),
      repeatPassword: string()
        .required($i18n.t('errorMessages.password.required'))
        .transform((value) => (value ? value.replace(/\s/g, '') : value))
        .test('passwords-match', $i18n.t('errorMessages.password.match'), function (value) {
          const passwordValue = this.parent.password?.replace(/\s/g, '');
          return value === passwordValue;
        })
        .default(state.value.defaultFormValues.repeatPassword),
      firstName: string()
        .trim()
        .when([], {
          is: () => !state.value.hasCompany,
          then: (schema) =>
            schema.required($i18n.t('errorMessages.requiredField')).default(state.value.defaultFormValues.firstName),
          otherwise: (schema) => schema.optional().default(state.value.defaultFormValues.firstName),
        }),
      lastName: string()
        .trim()
        .when([], {
          is: () => !state.value.hasCompany,
          then: (schema) =>
            schema.required($i18n.t('errorMessages.requiredField')).default(state.value.defaultFormValues.lastName),
          otherwise: (schema) => schema.optional().default(state.value.defaultFormValues.lastName),
        }),
      companyName: string()
        .trim()
        .when([], {
          is: () => state.value.hasCompany,
          then: (schema) =>
            schema.required($i18n.t('errorMessages.requiredField')).default(state.value.defaultFormValues.companyName),
          otherwise: (schema) => schema.optional().default(state.value.defaultFormValues.companyName),
        }),
      vatNumber: string()
        .trim()
        .when([], {
          is: () => state.value.hasCompany,
          then: (schema) => schema.default(state.value.defaultFormValues.vatNumber),
          otherwise: (schema) => schema.optional().default(state.value.defaultFormValues.vatNumber),
        }),
      streetName: string()
        .trim()
        .required($i18n.t('errorMessages.requiredField'))
        .default(state.value.defaultFormValues.streetName),
      apartment: string()
        .trim()
        .required($i18n.t('errorMessages.requiredField'))
        .default(state.value.defaultFormValues.apartment),
      city: string()
        .trim()
        .required($i18n.t('errorMessages.requiredField'))
        .default(state.value.defaultFormValues.city),
      zipCode: string()
        .trim()
        .required($i18n.t('errorMessages.requiredField'))
        .when('country', ([countryId], schema) => {
          const zipCodeRegex = getCountryZipCodeRegex(Number(countryId), AddressType.Shipping);
          return zipCodeRegex
            ? schema.matches(zipCodeRegex, $i18n.t('PreferredDelivery.packstation.zipcodeInvalid'))
            : schema;
        })
        .default(state.value.defaultFormValues.zipCode),
      country: string()
        .trim()
        .required($i18n.t('errorMessages.requiredField'))
        .default(state.value.defaultFormValues.country ?? cartGetters.getShippingCountryId(cartData.value).toString()),
      privacyPolicy: boolean().isTrue($i18n.t('privacyPolicyRequired')).required($i18n.t('privacyPolicyRequired')),
      turnstile:
        turnstileSiteKey.length > 0
          ? string()
              .trim()
              .required($i18n.t('errorMessages.turnstileRequired'))
              .default(state.value.defaultFormValues.turnstile)
          : string().trim().optional().default(state.value.defaultFormValues.turnstile),
    }),
  );

  const { errors, meta, defineField, handleSubmit } = useForm({ validationSchema });

  const [email, emailAttributes] = defineField('email');
  const [password, passwordAttributes] = defineField('password');
  const [repeatPassword, repeatPasswordAttributes] = defineField('repeatPassword');
  const [turnstile, turnstileAttributes] = defineField('turnstile');
  const [privacyPolicy, privacyPolicyAttributes] = defineField('privacyPolicy');
  const [firstName, firstNameAttributes] = defineField('firstName');
  const [lastName, lastNameAttributes] = defineField('lastName');
  const [country, countryAttributes] = defineField('country');
  const [streetName, streetNameAttributes] = defineField('streetName');
  const [apartment, apartmentAttributes] = defineField('apartment');
  const [city, cityAttributes] = defineField('city');
  const [zipCode, zipCodeAttributes] = defineField('zipCode');
  const [companyName, companyNameAttributes] = defineField('companyName');
  const [vatNumber, vatNumberAttributes] = defineField('vatNumber');

  const clearTurnstile = () => {
    turnstile.value = '';
    state.value.turnstileElement?.reset?.();
  };

  const getRegisterData = () => {
    return {
      'cf-turnstile-response': turnstile.value ?? '',
      contact: {
        password: password.value ?? '',
        typeId: 1,
        referrerId: 1,
        options: {
          typeId: {
            value: email.value ?? '',
            subTypeId: 4,
            priority: 0,
            typeId: 2,
          },
        },
      },
      deliveryAddress: {
        firstName: firstName.value,
        lastName: lastName.value,
        companyName: state.value.hasCompany ? companyName.value : '',
        vatNumber: state.value.hasCompany ? vatNumber.value : '',
        streetName: streetName.value,
        apartment: apartment.value,
        city: city.value,
        zipCode: zipCode.value,
        country: country.value,
        primary: true,
      } as Address,
      billingAddress: {
        firstName: firstName.value,
        lastName: lastName.value,
        companyName: state.value.hasCompany ? companyName.value : '',
        vatNumber: state.value.hasCompany ? vatNumber.value : '',
        streetName: streetName.value,
        apartment: apartment.value,
        city: city.value,
        zipCode: zipCode.value,
        country: country.value,
        primary: true,
      } as Address,
    };
  };

  const registerUser = async () => {
    if (!meta.value.valid || (!turnstile.value && turnstileSiteKey.length > 0) || isAuthorized.value) {
      return;
    }

    const response = await register(getRegisterData());

    if (response?.data.code === 1) {
      send({ message: $i18n.t('auth.signup.emailAlreadyExists'), type: 'negative' });
      clearTurnstile();
      return;
    }

    if (response?.data?.id) {
      send({ message: $i18n.t('auth.signup.success'), type: 'positive' });
    }

    return response;
  };

  const navigateAfterRegistration = async () => {
    const redirectUrl = router.currentRoute.value.query.redirect as string;
    await navigateTo(redirectUrl ? localePath(redirectUrl) : localePath(paths.home));
  };

  const onSubmit = handleSubmit(async () => {
    await registerUser();
    if (isAuthorized.value) await navigateAfterRegistration();
  });

  const passwordValidationLength = computed(() => {
    const val = password?.value || '';
    return val.length >= passwordMinLength && val.length <= passwordMaxLength;
  });

  const passwordValidationOneDigit = computed(() => /\d/.test(password?.value || ''));
  const passwordValidationOneLetter = computed(() => /[A-Za-z]/.test(password?.value || ''));

  return {
    hasCompany: toRef(state.value, 'hasCompany'),
    invalidVAT: toRef(state.value, 'invalidVAT'),
    turnstileElement: toRef(state.value, 'turnstileElement'),
    errors,
    onSubmit,
    passwordValidationLength,
    passwordValidationOneDigit,
    passwordValidationOneLetter,
    turnstileSiteKey,
    formFields: {
      email,
      password,
      repeatPassword,
      privacyPolicy,
      turnstile,
      firstName,
      lastName,
      country,
      streetName,
      apartment,
      city,
      zipCode,
      companyName,
      vatNumber,
    },
    formFieldsAttributes: {
      email: emailAttributes,
      password: passwordAttributes,
      repeatPassword: repeatPasswordAttributes,
      privacyPolicy: privacyPolicyAttributes,
      turnstile: turnstileAttributes,
      firstName: firstNameAttributes,
      lastName: lastNameAttributes,
      country: countryAttributes,
      streetName: streetNameAttributes,
      apartment: apartmentAttributes,
      city: cityAttributes,
      zipCode: zipCodeAttributes,
      companyName: companyNameAttributes,
      vatNumber: vatNumberAttributes,
    },
  };
};
