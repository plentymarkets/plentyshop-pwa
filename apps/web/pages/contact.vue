<template>
  <NuxtLayout name="default">
    <div class="md:max-w-[677px] mx-auto px-4 pt-4 pb-20 md:px-0 md:mt-4">
      <h1 class="font-bold mb-10 typography-headline-3 md:typography-headline-2">
        {{ t('contact.contact') }}
      </h1>
      <p class="mb-10">{{ t('contact.contactShopMessage') }}</p>

      <form data-testid="contact-form" class="flex flex-col rounded-md gap-4" @submit.prevent="onSubmit" novalidate>
        <div class="">
          <label>
            <UiFormLabel class="mb-1">{{ t('contact.form.nameLabel') }} {{ t('form.required') }}</UiFormLabel>
            <SfInput
              v-bind="nameAttributes"
              name="name"
              type="text"
              v-model="name"
              :invalid="Boolean(errors['name'])"
            />
          </label>
          <VeeErrorMessage as="div" name="name" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </div>
        <div class="">
          <label>
            <UiFormLabel class="mb-1">{{ t('contact.form.emailLabel') }} {{ t('form.required') }}</UiFormLabel>

            <SfInput
              name="email"
              type="email"
              autocomplete="email"
              v-bind="emailAttributes"
              v-model="email"
              :invalid="Boolean(errors['email'])"
            >
              <template #prefix>
                <SfIconEmail />
              </template>
            </SfInput>
          </label>
          <VeeErrorMessage as="div" name="email" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </div>
        <label>
          <UiFormLabel class="mb-1">{{ t('contact.form.subjectLabel') }} {{ t('form.required') }}</UiFormLabel>
          <SfInput name="subject" type="text" v-model="subject" v-bind="subjectAttributes" />
          <VeeErrorMessage as="div" name="subject" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </label>
        <label>
          <UiFormLabel class="mb-1">{{ t('contact.form.order-id') }} {{ t('form.required') }}</UiFormLabel>
          <SfInput name="order-id" type="text" v-model="orderId" v-bind="orderIdAttributes" />
          <VeeErrorMessage as="div" name="orderId" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </label>

        <div>
          <label class="flex flex-col">
            <UiFormLabel class="mb-1">{{ t('contact.form.message') }} {{ t('form.required') }}</UiFormLabel>
            <SfTextarea
              :placeholder="t('contact.form.message-placeholder')"
              class="w-full"
              name="message"
              v-bind="messageAttributes"
              v-model="message"
              :invalid="Boolean(errors['message'])"
              required
            />
          </label>
          <VeeErrorMessage as="div" name="message" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </div>

        <div>
          <div class="flex items-center">
            <SfCheckbox
              :invalid="Boolean(errors['privacyPolicy'])"
              id="terms"
              v-model="privacyPolicy"
              v-bind="privacyPolicyAttributes"
              value="value"
              class="peer"
              required
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
          <VeeErrorMessage as="div" name="privacyPolicy" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </div>

        <p class="text-sm text-neutral-500 mb-2">{{ t('form.required') }} {{ t('contact.form.asterixHint') }}</p>

        <div class="md:col-span-3 flex flex-col-reverse md:flex-row justify-end gap-4">
          <SfButton type="button" variant="secondary" :disabled="isContactLoading" @click="clearInputs">
            {{ t('contact.clearAll') }}
          </SfButton>
          <SfButton data-testid="save-address" type="submit" class="min-w-[120px]" :disabled="isContactLoading">
            <SfLoaderCircular v-if="isContactLoading" class="flex justify-center items-center" size="sm" />
            <span v-else>
              {{ t('contact.contactSend') }}
            </span>
          </SfButton>
        </div>

        <div>
          <NuxtTurnstile
            v-if="turnstileSiteKey"
            v-model="turnstile"
            v-bind="turnstileAttributes"
            ref="turnstileElement"
            :options="{ theme: 'light' }"
            class="mt-4"
          />
          <VeeErrorMessage as="div" name="turnstile" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfButton, SfInput, SfCheckbox, SfLink, SfTextarea, SfLoaderCircular, SfIconEmail } from '@storefront-ui/vue';
import { boolean, object, string } from 'yup';
import { useForm } from 'vee-validate';

definePageMeta({
  layout: false,
});

const runtimeConfig = useRuntimeConfig();

const { t } = useI18n();
const { loading: isContactLoading, doCustomerContactMail } = useCustomerContact();
const localePath = useLocalePath();
const turnstileSiteKey = runtimeConfig.public?.turnstileSiteKey ?? '';
const turnstileElement = ref();
const { send } = useNotification();

const validationSchema = toTypedSchema(
  object({
    name: string().required(t('errorMessages.contact.nameRequired')).default(''),
    email: string().email(t('errorMessages.email.valid')).required(t('errorMessages.email.required')).default(''),
    message: string().required(t('errorMessages.contact.messageRequired')).default(''),
    subject: string().required(t('errorMessages.requiredField')).default(''),
    orderId: string()
      .required(t('errorMessages.requiredField'))
      .test((value, context) => {
        if (value && /\D/.test(value)) {
          return context.createError({ message: t('errorMessages.wholeNumber') });
        }
        return true;
      }),
    privacyPolicy: boolean().oneOf([true], t('errorMessages.contact.termsRequired')).default(false),
    turnstile: string().required(t('errorMessages.contact.turnstileRequired')).default(''),
  }),
);

const { errors, meta, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: validationSchema,
});

const [name, nameAttributes] = defineField('name');
const [email, emailAttributes] = defineField('email');
const [subject, subjectAttributes] = defineField('subject');
const [orderId, orderIdAttributes] = defineField('orderId');
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

const sendContact = async () => {
  if (!meta.value.valid || !turnstile.value) {
    return;
  }

  const params = {
    name: name?.value || '',
    email: email?.value || '',
    subject: subject?.value || '',
    orderId: orderId?.value || '',
    message: message.value || '',
    'cf-turnstile-response': turnstile.value,
  };

  if (await doCustomerContactMail(params)) {
    send({
      type: 'positive',
      message: t('contact.success'),
    });
    resetForm();
  }

  turnstile.value = '';
  turnstileElement.value?.reset();
};

const onSubmit = handleSubmit(() => sendContact());
</script>
