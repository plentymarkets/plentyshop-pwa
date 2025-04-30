import type { PackstationList, PackstationsSearchParams } from '@plentymarkets/shop-api';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';

export const usePackstationFinder = () => {
  const { $i18n } = useNuxtApp();
  const genericMessage = $i18n.t('PreferredDelivery.packstation.noResult2');

  const state = useState('usePackstationFinder', () => ({
    loading: false,
    data: {
      packstations: [] as PackstationList,
      searchParams: {
        street: '',
        zipcode: '',
        city: '',
        searchPackstation: true,
        searchPostfilial: true,
      } as PackstationsSearchParams,
    },
  }));

  const conditionalField = (otherField1: string, otherField2: string) =>
    string().when([], {
      is: () =>
        !(
          state.value.data.searchParams[otherField1 as keyof typeof state.value.data.searchParams] ||
          state.value.data.searchParams[otherField2 as keyof typeof state.value.data.searchParams]
        ),
      then: () => string().required(genericMessage).min(3, genericMessage).default(''),
      otherwise: () => string().optional().default(''),
    });

  const validationSchema = toTypedSchema(
    object({
      searchParams: object({
        street: conditionalField('zipcode', 'city'),
        zipcode: conditionalField('street', 'city'),
        city: conditionalField('street', 'zipcode'),
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
