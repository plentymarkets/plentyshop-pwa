<template>
  <div class="text-lg font-medium ml-8" :class="{ 'text-center !ml-0': !isModal }">{{ t('auth.login.heading') }}</div>
  <div class="flex flex-col items-center justify-center my-1">
    <form @submit.prevent="loginUser" class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-full md:w-[400px]">
      <label>
        <UiFormLabel>{{ t('form.emailLabel') }} {{ t('form.required') }}</UiFormLabel>
        <SfInput name="email" type="email" autocomplete="email" v-model="email" required />
      </label>

      <label>
        <UiFormLabel>{{ t('form.passwordLabel') }} {{ t('form.required') }}</UiFormLabel>
        <UiFormPasswordInput name="password" autocomplete="current-password" v-model="password" required />
      </label>

      <UiButton type="submit" class="mt-2" :disabled="loading" data-testid="login-submit">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ t('auth.login.submitLabel') }}
        </span>
      </UiButton>
      <div v-if="!isSoftLogin" class="text-center">
        <div class="my-5 font-bold">{{ t('auth.login.createAccount') }}</div>
        <SfLink @click="$emit('change-view')" variant="primary" class="cursor-pointer">
          {{ t('auth.login.createAccountLinkLabel') }}
        </SfLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfLink, SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import type { LoginProps } from './types';

const { login, loading, getSession } = useCustomer();
const { send } = useNotification();
const { t } = useI18n();

const { isSoftLogin = false, isModal = false } = defineProps<LoginProps>();
const emits = defineEmits(['loggedIn', 'change-view']);

const email = ref('');
const password = ref('');

const loginUser = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    send({ message: t('auth.login.success'), type: 'positive' });
    emits('loggedIn');
    window.location.reload();
  }
};
</script>
