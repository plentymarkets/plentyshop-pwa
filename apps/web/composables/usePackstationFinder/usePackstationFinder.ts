import type { PackstationsSearchParams } from '@plentymarkets/shop-api';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';

export const usePackstationFinder = () => {
  const { $i18n } = useNuxtApp();
  const state = useState('usePackstationFinder', () => ({
    loading: false,
    formTouched: false,
    data: {
      packstations: {},
      searchParams: {
        street: '',
        zipcode: '',
        city: '',
        searchPackstation: true,
        searchPostfilial: true,
      } as PackstationsSearchParams,
    },
  }));

  const validationSchema = toTypedSchema(
    object({
      searchParams: object({
        street: string().when([], {
          is: () => !(state.value.data.searchParams.zipcode || state.value.data.searchParams.city),
          then: () => string().required($i18n.t('PreferredDelivery.general.preferredLocationAlertMessage')).default(''),
          otherwise: () => string().optional().default(''),
        }),
        zipcode: string().when([], {
          is: () => !(state.value.data.searchParams.street || state.value.data.searchParams.city),
          then: () => string().required($i18n.t('PreferredDelivery.general.preferredLocationAlertMessage')).default(''),
          otherwise: () => string().optional().default(''),
        }),
        city: string().when([], {
          is: () => !(state.value.data.searchParams.street || state.value.data.searchParams.zipcode),
          then: () => string().required($i18n.t('PreferredDelivery.general.preferredLocationAlertMessage')).default(''),
          otherwise: () => string().optional().default(''),
        }),
      }),
    }),
  );

  const submitForm = async () => {
    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.getPackstations(state.value.data.searchParams);
      state.value.data.packstations = data;
      state.value.loading = false;
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.log(error?.toString());
      state.value.loading = false;
    }
  };

  return {
    validationSchema,
    submitForm,
    ...toRefs(state.value),
  };
};
