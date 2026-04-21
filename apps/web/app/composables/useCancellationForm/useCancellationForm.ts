import type { ApiError } from '@plentymarkets/shop-api';
import { userGetters } from '@plentymarkets/shop-api';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import type { SubmitCancellation, UseCancellationFormState } from './types';

export const useCancellationForm = () => {
  const state = useState<UseCancellationFormState>('useCancellationForm', () => ({
    loading: false,
  }));

  const { getSetting } = useSiteSettings('cloudflareTurnstileApiSiteKey');
  const turnstileSiteKey = getSetting() ?? '';

  const validationSchema = toTypedSchema(
    object({
      orderId: string()
        .trim()
        .required(t('error.requiredField'))
        .matches(/^[1-9][0-9]*$/, t('cancellationForm.orderIdInvalid'))
        .default(''),
      name: string().trim().required(t('error.requiredField')).default(''),
      reason: string().trim().optional().default(''),
      email: string()
        .trim()
        .required(t('error.email.required'))
        .test('is-valid-email', t('storefrontError.contactMail.emailInvalid'), (mail: string) =>
          userGetters.isValidEmailAddress(mail),
        )
        .default(''),
      turnstile:
        turnstileSiteKey.length > 0
          ? string().required(t('error.turnstileRequired')).default('')
          : string().optional().default(''),
    }),
  );

  const submitCancellation: SubmitCancellation = async (params) => {
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.doSubmitCancellation(params);
      return data?.email ?? null;
    } catch (error) {
      useHandleError(error as ApiError);
      return null;
    } finally {
      state.value.loading = false;
    }
  };

  return {
    submitCancellation,
    validationSchema,
    turnstileSiteKey,
    ...toRefs(state.value),
  };
};
