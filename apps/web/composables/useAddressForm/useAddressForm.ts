import { type Address, AddressType } from '@plentymarkets/shop-api';
import { object, string, boolean } from 'yup';

export const useAddressForm = (type: AddressType) => {
  const { create } = useCreateAddress(type);
  const { $i18n } = useNuxtApp();

  const state = useState('useAddressForm' + type, () => ({
    isLoading: false,
    add: false,
    open: false,
    hasCompany: false,
    addressToSave: {} as Address,
    addressToEdit: {} as Address,
  }));

  const setInitialState = () => {
    state.value.isLoading = false;
    state.value.add = false;
    state.value.open = false;
    state.value.addressToSave = {} as Address;
    state.value.addressToEdit = {} as Address;
  };

  const save = async () => {
    if (!state.value.addressToSave) return true;
    state.value.isLoading = true;

    await create(state.value.addressToSave as Address);
    state.value.open = false;
    state.value.isLoading = false;
    return true;
  };

  const validationSchema = toTypedSchema(
    object({
      firstName: string().when([], {
        is: () => !state.value.hasCompany,
        // eslint-disable-next-line unicorn/no-thenable
        then: () => string().required($i18n.t('errorMessages.requiredField')).default(''),
        otherwise: () => string().optional().default(''),
      }),
      lastName: string().when([], {
        is: () => !state.value.hasCompany,
        // eslint-disable-next-line unicorn/no-thenable
        then: () => string().required($i18n.t('errorMessages.requiredField')).default(''),
        otherwise: () => string().optional().default(''),
      }),
      country: string().required($i18n.t('errorMessages.requiredField')).default(''),
      streetName: string().required($i18n.t('errorMessages.requiredField')).default(''),
      apartment: string().required($i18n.t('errorMessages.requiredField')).default(''),
      city: string().required($i18n.t('errorMessages.requiredField')).default(''),
      state: string().default('').optional(),
      zipCode: string().required($i18n.t('errorMessages.requiredField')).min(5),
      primary: boolean().default(false),
      company: string().when([], {
        is: () => state.value.hasCompany,
        // eslint-disable-next-line unicorn/no-thenable
        then: () => string().required($i18n.t('errorMessages.requiredField')).default(''),
        otherwise: () => string().optional().default(''),
      }),
      vatId: string().when([], {
        is: () => state.value.hasCompany,
        // eslint-disable-next-line unicorn/no-thenable
        then: () => string().required($i18n.t('errorMessages.requiredField')).default(''),
        otherwise: () => string().optional().default(''),
      }),
    }),
  );

  return {
    setInitialState,
    save,
    validationSchema,
    ...toRefs(state.value),
  };
};
