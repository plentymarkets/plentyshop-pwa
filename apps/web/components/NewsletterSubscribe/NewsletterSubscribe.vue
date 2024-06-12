<template>
  <div class="relative mt-5 bg-neutral-100 p-4 sm:p-10 text-center">
    <p class="typography-headline-4 sm:typography-headline-3 font-bold mb-2">
      {{ t('newsletter.heading') }}
    </p>
    <p class="typography-text-sm sm:typography-text-base my-2 mb-4">
      {{ t('newsletter.info') }}
    </p>

    <form @submit.prevent="onSubmit" class="mx-auto max-w-[550px] pt-2" novalidate>
      <div v-if="showNames" class="grid grid-cols-1 sm:grid-cols-2">
        <div class="sm:mr-[1rem]">
          <SfInput
            v-model="firstName"
            v-bind="firstNameAttributes"
            :invalid="Boolean(errors['firstName'])"
            :placeholder="`${t('newsletter.firstName')} **`"
            :wrapper-class="wrapperClass"
            type="text"
            name="firstName"
          />
          <div class="h-[2rem]">
            <VeeErrorMessage as="div" name="firstName" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
          </div>
        </div>

        <div class="sm:ml-[1rem]">
          <SfInput
            v-model="lastName"
            v-bind="lastNameAttributes"
            :invalid="Boolean(errors['lastName'])"
            :placeholder="`${t('newsletter.lastName')} **`"
            :wrapper-class="wrapperClass"
            type="text"
            name="lastName"
          />
          <div class="h-[2rem]">
            <VeeErrorMessage as="div" name="lastName" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1">
        <SfInput
          v-model="email"
          v-bind="emailAttributes"
          :invalid="Boolean(errors['email'])"
          :placeholder="`${t('newsletter.email')} **`"
          :wrapper-class="wrapperClass"
          type="email"
          name="email"
          autocomplete="email"
        />
        <div class="h-[2rem]">
          <VeeErrorMessage as="div" name="email" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </div>
      </div>

      <div class="text-base text-neutral-900">
        <div class="flex justify-center items-center">
          <SfCheckbox
            v-model="privacyPolicy"
            v-bind="privacyPolicyAttributes"
            :invalid="Boolean(errors['privacyPolicy'])"
            id="terms-checkbox"
            class="inline-block mr-2"
            data-testid="checkout-terms-checkbox"
          />
          <label for="terms-checkbox" class="text-left leading-5 select-none">
            <i18n-t keypath="newsletter.policy" scope="global">
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
            **
          </label>
        </div>
        <div class="h-[2rem]">
          <VeeErrorMessage as="div" name="privacyPolicy" class="text-negative-700 text-left text-sm pt-[0.2rem]" />
        </div>
      </div>

      <div class="flex flex-col items-center">
        <SfButton type="submit" size="lg" :disabled="loading">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
          <template v-else>{{ t('newsletter.subscribe') }}</template>
        </SfButton>

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

    <div class="text-left typography-text-xs mt-3">** {{ t('contact.form.asterixHint') }}</div>
  </div>
</template>

<script lang="ts" setup>
import { SfButton, SfCheckbox, SfInput, SfLink, SfLoaderCircular } from '@storefront-ui/vue';
import { useForm } from 'vee-validate';
import { object, string, boolean } from 'yup';

const runtimeConfig = useRuntimeConfig();
const { subscribe, loading, showNames } = useNewsletter();
const { send } = useNotification();
const localePath = useLocalePath();
const { t } = useI18n();

const turnstileSiteKey = runtimeConfig.public?.turnstileSiteKey ?? '';
const turnstileElement = ref();
const wrapperClass = 'focus-within:outline focus-within:outline-offset';

const validationSchema = toTypedSchema(
  object({
    firstName: showNames.value
      ? string().required(t('errorMessages.newsletter.firstNameRequired')).default('')
      : string().optional().default(''),
    lastName: showNames.value
      ? string().required(t('errorMessages.newsletter.lastNameRequired')).default('')
      : string().optional().default(''),
    email: string().email(t('errorMessages.email.valid')).required(t('errorMessages.email.required')).default(''),
    privacyPolicy: boolean().oneOf([true], t('errorMessages.newsletter.termsRequired')).default(false),
    turnstile:
      turnstileSiteKey.length > 0
        ? string().required(t('errorMessages.newsletter.turnstileRequired')).default('')
        : string().optional().default(''),
  }),
);

const { errors, meta, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: validationSchema,
});

const [firstName, firstNameAttributes] = defineField('firstName');
const [lastName, lastNameAttributes] = defineField('lastName');
const [email, emailAttributes] = defineField('email');
const [turnstile, turnstileAttributes] = defineField('turnstile');
const [privacyPolicy, privacyPolicyAttributes] = defineField('privacyPolicy');

const subscribeNewsletter = async () => {
  if (!meta.value.valid || !turnstile.value) {
    return;
  }

  const response = await subscribe({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value || '',
    emailFolder: 1,
    'cf-turnstile-response': turnstile.value,
  });

  if (response) {
    send({
      type: 'positive',
      message: t('newsletter.success'),
    });
    resetForm();
  }

  turnstile.value = '';
  turnstileElement.value?.reset();
};

const onSubmit = handleSubmit(() => subscribeNewsletter());
</script>
