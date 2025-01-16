<template>
  <div class="text-lg font-medium ml-8" :class="{ 'text-center !ml-0': !isModal }">{{ t('auth.login.heading') }}</div>
  <div class="flex flex-col items-center justify-center my-1">
    <form class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-full md:w-[400px]" @submit.prevent="loginUser">
      <label>
        <UiFormLabel>{{ t('form.emailLabel') }} {{ t('form.required') }}</UiFormLabel>
        <SfInput v-model="email" name="email" type="email" autocomplete="email" required />
      </label>

      <label>
        <UiFormLabel>{{ t('form.passwordLabel') }} {{ t('form.required') }}</UiFormLabel>
        <UiFormPasswordInput v-model="password" name="password" autocomplete="current-password" required />
      </label>

      <UiButton type="submit" class="mt-2" :disabled="loading" data-testid="login-submit">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ t('auth.login.submitLabel') }}
        </span>
      </UiButton>
      <div v-if="!isSoftLogin" class="text-center">
        <div class="my-5 font-bold">{{ t('auth.login.createAccount') }}</div>
        <SfLink variant="primary" class="cursor-pointer" @click="$emit('change-view')">
          {{ t('auth.login.createAccountLinkLabel') }}
        </SfLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfLink, SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import type { LoginProps } from './types';

const { login, loading } = useCustomer();
const { send } = useNotification();
const { t } = useI18n();

const { isSoftLogin = false, isModal = false, skipReload = false } = defineProps<LoginProps>();
const emits = defineEmits(['loggedIn', 'change-view']);

const email = ref('');
const password = ref('');

const loginUser = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    send({ message: t('auth.login.success'), type: 'positive' });
    emits('loggedIn', skipReload);
  }
};
</script>
