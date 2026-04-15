<template>
  <div class="w-full p-5 overflow-x-auto no-preflight" v-html="getHTMLTexts()" />

  <div class="mx-auto my-8 w-full max-w-4xl rounded-md border border-neutral-200 bg-white p-8">
    <h2 class="mb-6 text-2xl font-semibold text-neutral-900">
      {{ t('legal.cancellationForm') }}
    </h2>

    <div
      v-if="turnstileSiteKey.length === 0"
      class="flex items-start bg-warning-100 shadow-md pr-4 pl-4 ring-1 ring-warning-200 typography-text-sm md:typography-text-base py-1 rounded-md mb-4"
    >
      <SfIconWarning class="mt-2 mr-2 text-warning-700 shrink-0" />
      <div class="py-2">{{ t('cancellationForm.misConfigured') }}</div>
    </div>

    <form
      v-else
      data-testid="cancellation-form"
      class="flex flex-col rounded-md gap-4"
      novalidate
      @submit.prevent="onSubmit"
    >
      <label>
        <UiFormLabel class="mb-1">{{ t('cancellationForm.orderId') }} {{ t('form.required') }}</UiFormLabel>
        <SfInput
          v-bind="orderIdAttributes"
          v-model="orderId"
          name="orderId"
          type="text"
          :invalid="Boolean(errors['orderId'])"
          :disabled="loading"
        />
        <ErrorMessage as="div" name="orderId" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
      </label>

      <label>
        <UiFormLabel class="mb-1">{{ t('cancellationForm.name') }} {{ t('form.required') }}</UiFormLabel>
        <SfInput
          v-bind="nameAttributes"
          v-model="name"
          name="name"
          type="text"
          :invalid="Boolean(errors['name'])"
          :disabled="loading"
        />
        <ErrorMessage as="div" name="name" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
      </label>

      <label>
        <UiFormLabel class="mb-1">{{ t('cancellationForm.email') }} {{ t('form.required') }}</UiFormLabel>
        <SfInput
          v-bind="emailAttributes"
          v-model="email"
          name="email"
          type="email"
          :invalid="Boolean(errors['email'])"
          :disabled="loading"
          autocomplete="email"
        />
        <ErrorMessage as="div" name="email" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
      </label>

      <p class="text-sm text-neutral-500 mb-2">{{ t('form.required') }} {{ t('cancellationForm.asterixHint') }}</p>

      <div class="flex flex-col-reverse md:flex-row justify-end gap-4">
        <UiButton type="submit" class="min-w-[120px]" :disabled="loading">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
          <span v-else>{{ t('cancellationForm.submit') }}</span>
        </UiButton>
      </div>

      <div>
        <NuxtTurnstile
          v-if="turnstileSiteKey.length > 0 && turnstileLoad"
          v-bind="turnstileAttributes"
          ref="turnstileElement"
          v-model="turnstile"
          :site-key="turnstileSiteKey"
          :options="{ theme: 'light' }"
          class="mt-4"
        />
        <ErrorMessage as="div" name="turnstile" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfLoaderCircular, SfIconWarning } from '@storefront-ui/vue';
import { object, string } from 'yup';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { userGetters } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  pageType: 'static',
});

const { data, getLegalTexts } = useLegalInformation();
const { loading, submitCancellation } = useCancellationForm();
const { getSetting } = useSiteSettings('cloudflareTurnstileApiSiteKey');
const turnstileSiteKey = getSetting() ?? '';
const turnstileElement = ref();
const turnstileLoad = ref(false);
const { send } = useNotification();
const { getRobots, setRobotForStaticPage } = useRobots();
const { setPageMeta } = usePageMeta();
const { locale } = useI18n();

setPageMeta(t('legal.cancellationForm'), 'page');

await getLegalTexts({ type: 'WithdrawalForm' });

const getHTMLTexts = () => data.value.htmlText ?? '';

await getRobots();
setRobotForStaticPage('CancellationForm');

const validationSchema = toTypedSchema(
  object({
    orderId: string()
      .trim()
      .required(t('error.requiredField'))
      .matches(/^[1-9][0-9]*$/, t('cancellationForm.orderIdInvalid'))
      .default(''),
    name: string()
      .trim()
      .required(t('error.requiredField'))
      .default(''),
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

const { errors, meta, defineField, handleSubmit, resetForm } = useForm({ validationSchema });

const [rawOrderId, orderIdAttributes] = defineField('orderId');
const orderId = rawOrderId as Ref<string>;
const [rawName, nameAttributes] = defineField('name');
const name = rawName as Ref<string>;
const [email, emailAttributes] = defineField('email');
const [turnstile, turnstileAttributes] = defineField('turnstile');

const submitForm = async () => {
  if (!meta.value.valid) return;

  const customerEmail = await submitCancellation({
    email: email.value || '',
    name: name.value || '',
    orderId: Number(orderId.value),
    lang: locale.value,
    'cf-turnstile-response': turnstile.value || '',
  });

  if (customerEmail) {
    send({
      type: 'positive',
      message: t('cancellationForm.success', { email: customerEmail }),
    });
    resetForm();
  }

  turnstile.value = '';
  turnstileElement.value?.reset();
};

const onSubmit = handleSubmit(() => submitForm());

if (turnstileSiteKey.length > 0) {
  const turnstileWatcher = watch([orderId, name, email], (data) => {
    if (data.some((field) => field && field.length > 0)) {
      turnstileLoad.value = true;
      turnstileWatcher();
    }
  });
}
</script>