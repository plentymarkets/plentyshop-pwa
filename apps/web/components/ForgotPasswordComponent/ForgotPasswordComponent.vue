<template>
  <div class="flex flex-col items-center justify-center mb-2">
    <form class="flex flex-col gap-4 p-1 rounded-md w-full md:w-[400px]" @submit.prevent="sendMail">
      <div class="text-lg font-medium">
        {{ t('auth.resetPassword.heading') }}
      </div>
      <p class="text-gray-700 text-sm mb-2">
        {{ t('auth.resetPassword.subHeading') }}
      </p>
      <label>
        <UiFormLabel>{{ t('form.emailLabel') }} {{ t('form.required') }}</UiFormLabel>
        <SfInput v-model="email" name="email" type="email" autocomplete="email" required />
      </label>

      <UiButton type="submit" class="mt-2" :disabled="loading" data-testid="reset-password-mail-submit">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ t('auth.resetPassword.resetPassword') }}
        </span>
      </UiButton>
      <UiButton
        v-if="!isForgotPasswordOnly"
        type="reset"
        variant="secondary"
        :disabled="loading"
        data-testid="reset-password-mail-submit"
        @click="$emit('change-view-login')"
      >
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ t('auth.resetPassword.backToLogin') }}
        </span>
      </UiButton>

      <div v-if="!isSoftLogin && !isForgotPasswordOnly" class="text-sm text-center">
        <span>{{ t('auth.login.createAccount') }}</span>
        <SfLink variant="primary" class="ml-1 cursor-pointer underline" @click="$emit('change-view-register')">
          {{ t('auth.login.createAccountLinkLabel') }}
        </SfLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import type { ForgotPasswordProps } from './types';

const { isSoftLogin = false, isForgotPasswordOnly = false } = defineProps<ForgotPasswordProps>();

const { sendEmail, loading } = useResetPassword();
const { send } = useNotification();
const { t } = useI18n();

const emits = defineEmits(['change-view-login', 'change-view-register']);

const email = ref('');

const sendMail = async () => {
  await sendEmail({ email: email.value });
  send({ message: t('auth.resetPassword.emailSent'), type: 'positive' });
  emits('change-view-login');
};
</script>
