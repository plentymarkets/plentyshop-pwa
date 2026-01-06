<template>
  <NuxtLayout name="auth" :heading="t('authentication.setNewPassword.heading')">
    <form class="pb-4 md:p-6 mt-10 md:border md:border-neutral-200 rounded-md" @submit.prevent>
      <p class="mb-6">
        {{ t('authentication.setNewPassword.description') }}
      </p>
      <label class="block mb-4">
        <UiFormLabel>{{ t('authentication.setNewPassword.password') }} {{ t('form.required') }}</UiFormLabel>
        <UiFormPasswordInput v-model="password" name="password" autocomplete="current-password" required />
        <UiFormHelperText>{{ t('authentication.setNewPassword.help') }}</UiFormHelperText>
      </label>
      <label>
        <UiFormLabel>{{ t('authentication.setNewPassword.repeatPassword') }} {{ t('form.required') }}</UiFormLabel>
        <UiFormPasswordInput
          v-model="repeatedPassword"
          name="repeatedPassword"
          autocomplete="current-password"
          required
        />
      </label>
      <div class="mt-6 flex flex-col-reverse md:flex-row gap-4">
        <UiButton type="submit" class="flex-1"> {{ t('authentication.setNewPassword.button') }} </UiButton>
      </div>
    </form>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});
definePageMeta({
  layout: false,
});

const { setPageMeta } = usePageMeta();

const icon = 'page';
setPageMeta(t('authentication.setNewPassword.button'), icon);

const password = ref('');
const repeatedPassword = ref('');
</script>
