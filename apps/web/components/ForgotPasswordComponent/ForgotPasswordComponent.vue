<template>
  <div class="text-lg font-medium text-center">{{ t('auth.resetPassword.heading') }}</div>
  <div class="flex flex-col items-center justify-center my-1">
    <form class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-full md:w-[400px]" @submit.prevent="sendMail">
      <label>
        <UiFormLabel>{{ t('form.emailLabel') }} {{ t('form.required') }}</UiFormLabel>
        <SfInput v-model="email" name="email" type="email" autocomplete="email" required />
      </label>

      <UiButton type="submit" class="mt-2" :disabled="loading" data-testid="login-submit">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ t('auth.resetPassword.resetPassword') }}
        </span>
      </UiButton>
      <UiButton type="reset" variant="secondary" :disabled="loading" data-testid="login-submit" @click="$emit('change-view')">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ t('auth.resetPassword.backToLogin') }}
        </span>
      </UiButton>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfInput, SfLoaderCircular } from '@storefront-ui/vue';

const { sendEmail, loading } = useResetPassword();
const { send } = useNotification();
const { t } = useI18n();

const emits = defineEmits(['change-view']);

const email = ref('');

const sendMail = async () => {
  await sendEmail(email.value);
  send({ message: t('auth.login.success'), type: 'positive' });
  emits('change-view');
};
</script>
