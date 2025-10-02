<template>
  <NuxtLayout name="default">
    <div class="md:max-w-[677px] mx-auto px-4 pt-4 pb-20 md:px-0 md:mt-4">
      <h1 class="font-bold mb-10 typography-headline-3 md:typography-headline-2">
        {{ t('contact.contact') }}
      </h1>
      <p class="mb-10">{{ t('contact.contactShopMessage') }}</p>

      <div
        v-if="turnstileSiteKey.length === 0"
        class="flex items-start bg-warning-100 shadow-md pr-4 pl-4 ring-1 ring-warning-200 typography-text-sm md:typography-text-base py-1 rounded-md mb-4"
      >
        <SfIconWarning class="mt-2 mr-2 text-warning-700 shrink-0" />
        <div class="py-2">{{ t('contact.misConfigured') }}</div>
      </div>

      <form
        v-else
        data-testid="contact-form"
        class="flex flex-col rounded-md gap-4"
        novalidate
        @submit.prevent="onSubmit"
      >
        <label>
          <UiFormLabel class="mb-1">{{ t('contact.form.nameLabel') }}</UiFormLabel>
          <SfInput v-bind="nameAttributes" v-model="name" name="name" type="text" :invalid="Boolean(errors['name'])" />
          <ErrorMessage as="div" name="name" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </label>

        <label>
          <UiFormLabel class="mb-1">{{ t('contact.form.emailLabel') }} {{ t('form.required') }}</UiFormLabel>
          <SfInput
            v-bind="emailAttributes"
            v-model="email"
            name="email"
            type="email"
            :invalid="Boolean(errors['email'])"
            autocomplete="email"
          />
          <ErrorMessage as="div" name="email" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </label>

        <label>
          <UiFormLabel class="mb-1">{{ t('contact.form.subjectLabel') }} {{ t('form.required') }}</UiFormLabel>
          <SfInput
            v-bind="subjectAttributes"
            v-model="subject"
            name="subject"
            type="text"
            :invalid="Boolean(errors['subject'])"
          />
          <ErrorMessage as="div" name="subject" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </label>

        <label>
          <UiFormLabel class="mb-1">{{ t('contact.form.order-id') }}</UiFormLabel>
          <SfInput
            v-bind="orderIdAttributes"
            v-model="orderId"
            name="orderId"
            type="text"
            :invalid="Boolean(errors['orderId'])"
          />
          <ErrorMessage as="div" name="orderId" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </label>

        <label class="flex flex-col">
          <UiFormLabel class="mb-1">{{ t('contact.form.message') }} {{ t('form.required') }}</UiFormLabel>
          <SfTextarea
            v-bind="messageAttributes"
            v-model="message"
            name="message"
            type="text"
            :invalid="Boolean(errors['message'])"
            :placeholder="t('contact.form.message-placeholder')"
            class="w-full"
          />
          <ErrorMessage as="div" name="message" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </label>

        <div>
          <div class="flex items-center">
            <SfCheckbox
              id="terms"
              v-bind="privacyPolicyAttributes"
              v-model="privacyPolicy"
              :invalid="Boolean(errors['privacyPolicy'])"
              value="value"
              class="peer"
            />
            <label
              class="ml-3 text-base text-neutral-900 cursor-pointer peer-disabled:text-disabled-900 select-none"
              for="terms"
            >
              <i18n-t keypath="contact.privacyPolicy" scope="global">
                <template #privacyPolicy>
                  <SfLink
                    :href="localePath(paths.privacyPolicy)"
                    target="_blank"
                    class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                  >
                    {{ t('privacyPolicy') }}
                  </SfLink>
                </template>
              </i18n-t>
              {{ t('form.required') }}
            </label>
          </div>
          <ErrorMessage as="div" name="privacyPolicy" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </div>

        <p class="text-sm text-neutral-500 mb-2">{{ t('form.required') }} {{ t('contact.form.asterixHint') }}</p>

        <div class="md:col-span-3 flex flex-col-reverse md:flex-row justify-end gap-4">
          <UiButton type="button" variant="secondary" :disabled="isContactLoading" @click="clearInputs">
            {{ t('contact.clearAll') }}
          </UiButton>
          <UiButton data-testid="save-address" type="submit" class="min-w-[120px]" :disabled="isContactLoading">
            <SfLoaderCircular v-if="isContactLoading" class="flex justify-center items-center" size="sm" />
            <span v-else>
              {{ t('contact.contactSend') }}
            </span>
          </UiButton>
        </div>

        <div>
          <NuxtTurnstile
            v-if="turnstileSiteKey && turnstileLoad"
            v-bind="turnstileAttributes"
            ref="turnstileElement"
            v-model="turnstile"
            :options="{ theme: 'light' }"
            class="mt-4"
          />
          <ErrorMessage as="div" name="turnstile" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { CustomerContactEmailParams } from '@plentymarkets/shop-api';
import { SfInput, SfCheckbox, SfLink, SfTextarea, SfLoaderCircular, SfIconWarning } from '@storefront-ui/vue';
import { boolean, object, string } from 'yup';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { paths } from '~/utils/paths';
import { userGetters } from '@plentymarkets/shop-api';

definePageMeta({
  layout: false,
  pageType: 'static',
});

const { t } = useI18n();
const { loading: isContactLoading, doCustomerContactMail } = useCustomerContact();
const localePath = useLocalePath();
const { getSetting } = useSiteSettings('cloudflareTurnstileApiSiteKey');
const turnstileSiteKey = getSetting() ?? '';
const turnstileElement = ref();
const turnstileLoad = ref(false);
const { send } = useNotification();
const { getRobots, setRobotForStaticPage } = useRobots();
const { setPageMeta } = usePageMeta();

const icon = 'page';
setPageMeta(t('categories.contact.label'), icon);

const validationSchema = toTypedSchema(
  object({
    email: string()
      .trim()
      .required(t('errorMessages.email.required'))
      .test('is-valid-email', t('storefrontError.contactMail.emailInvalid'), (mail: string) =>
        userGetters.isValidEmailAddress(mail),
      )
      .default(''),
    message: string()
      .required(t('errorMessages.contact.messageRequired'))
      .test('min-clean-length', t('storefrontError.contactMail.messageInvalid'), (val: string | undefined) => {
        if (!val) return false;
        const cleaned = val.replace(/\n/g, '').trim();
        return cleaned.length >= 3;
      })
      .default(''),
    name: string()
      .trim()
      .notRequired()
      .default('')
      .test('min-if-not-empty', t('storefrontError.contactMail.nameInvalid'), (val) => {
        if (!val || val.length === 0) return true;
        return val.length >= 3;
      }),
    subject: string()
      .trim()
      .required(t('errorMessages.contact.subjectRequired'))
      .default('')
      .test('min-length', t('storefrontError.contactMail.subjectInvalid'), (val) => !!(val && val.length >= 3)),
    orderId: string()
      .trim()
      .notRequired()
      .default('')
      .test(
        'digits-if-not-empty',
        t('storefrontError.contactMail.orderIdInvalid'),
        (val) => !val || /^[1-9][0-9]*$/.test(val),
      ),
    privacyPolicy: boolean().oneOf([true], t('errorMessages.contact.termsRequired')).default(false),
    turnstile:
      turnstileSiteKey.length > 0
        ? string().required(t('errorMessages.contact.turnstileRequired')).default('')
        : string().optional().default(''),
  }),
);

const { errors, meta, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: validationSchema,
});

const [rawName, nameAttributes] = defineField('name');
const name = rawName as Ref<string>;
const [email, emailAttributes] = defineField('email');
const [rawSubject, subjectAttributes] = defineField('subject');
const subject = rawSubject as Ref<string>;
const [rawOrderId, orderIdAttributes] = defineField('orderId');
const orderId = rawOrderId as Ref<string>;
const [message, messageAttributes] = defineField('message');
const [privacyPolicy, privacyPolicyAttributes] = defineField('privacyPolicy');
const [turnstile, turnstileAttributes] = defineField('turnstile');

const clearInputs = () => {
  name.value = '';
  email.value = '';
  message.value = '';
  orderId.value = '';
  subject.value = '';
  privacyPolicy.value = false;
};

const submitForm = async () => {
  if (!meta.value.valid || !turnstile.value) return;

  const params: CustomerContactEmailParams = {
    subject: subject.value || '',
    email: email.value || '',
    message: message.value || '',
    'cf-turnstile-response': turnstile.value,
  };

  if (name.value) params.name = name.value;
  if (orderId.value) params.orderId = Number(orderId.value);

  if (await doCustomerContactMail(params)) {
    send({ type: 'positive', message: t('contact.success') });
    resetForm();
  }

  turnstile.value = '';
  turnstileElement.value?.reset();
};

const onSubmit = handleSubmit(() => submitForm());

await getRobots();
setRobotForStaticPage('ContactPage');

if (turnstileSiteKey.length > 0) {
  const turnstileWatcher = watch([name, email, subject, orderId, message], (data) => {
    if (data.some((field) => field && field.length > 0)) {
      turnstileLoad.value = true;
      turnstileWatcher();
    }
  });
}
</script>
