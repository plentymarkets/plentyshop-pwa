<template>
  <NuxtLayout name="default">
    <div class="@md:max-w-[677px] mx-auto px-4 pt-4 pb-20 @md:px-0 @md:mt-4">
      <h1 class="font-bold mb-4 typography-headline-3 @md:typography-headline-2">
        {{ t('heading') }}
      </h1>
      <p class="mb-10">{{ t('info') }}</p>

      <form class="flex flex-col gap-4" novalidate @submit.prevent="onSubmit">
        <label>
          <UiFormLabel class="mb-1">{{ t('newsletter.email') }} *</UiFormLabel>
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

        <UiButton type="submit" class="w-full" :disabled="loading" data-testid="newsletter-unsubscribe-button">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
          <span v-else>{{ t('submit') }}</span>
        </UiButton>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import { object, string } from 'yup';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import type { Locale } from '#i18n';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  layout: false,
  pageType: 'static',
});

const { t } = useI18n();
const { unsubscribe, loading } = useNewsletter();
const { send } = useNotification();

const validationSchema = toTypedSchema(
  object({
    email: string().email(t('error.email.valid')).required(t('error.email.required')).default(''),
  }),
);

const { errors, defineField, handleSubmit, resetForm } = useForm({ validationSchema });
const [email, emailAttributes] = defineField('email');

const submitForm = async () => {
  const success = await unsubscribe(email.value || '');
  if (success) {
    send({ type: 'positive', message: t('success') });
    resetForm();
  }
};

const onSubmit = handleSubmit(() => submitForm());
</script>

<i18n lang="json">
{
  "en": {
    "heading": "Unsubscribe from Newsletter",
    "info": "Enter your email address below to unsubscribe from our newsletter.",
    "submit": "Unsubscribe",
    "success": "You have been successfully unsubscribed from our newsletter."
  },
  "de": {
    "heading": "Newsletter abbestellen",
    "info": "Geben Sie Ihre E-Mail-Adresse ein, um den Newsletter abzubestellen.",
    "submit": "Abbestellen",
    "success": "Sie wurden erfolgreich vom Newsletter abgemeldet."
  }
}
</i18n>
