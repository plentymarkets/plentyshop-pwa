<template>
  <div>
    <div class="text-lg font-medium text-center !ml-0">Reset Password</div>
    <div class="flex flex-col items-center justify-center my-1">
      <form class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-full md:w-[400px]" @submit.prevent="executeResetPassword">
        <label>
          <UiFormLabel>{{ t('form.passwordLabel') }} {{ t('form.required') }}</UiFormLabel>
          <UiFormPasswordInput v-model="password" name="password" required />
        </label>

        <label>
          <UiFormLabel>{{ t('form.passwordLabel') }}2 {{ t('form.required') }}</UiFormLabel>
          <UiFormPasswordInput v-model="password2" name="password2" required />
        </label>

        <UiButton type="submit" class="mt-2" :disabled="loading" data-testid="login-submit">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
          <span v-else>
            Save new password
          </span>
        </UiButton>
        <div class="text-center">
          <span class="my-5 font-bold">Remember your password?</span>
          <SfLink variant="primary" class="cursor-pointer">
            Login
          </SfLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SfLink, SfLoaderCircular } from '@storefront-ui/vue';

const { loading } = useResetPassword();
const { t } = useI18n();
const route = useRoute();

const password = ref('');
const password2 = ref('');
const hash = route.params.hash;
const contactId =route.params.contactId;

const executeResetPassword = async () => {
  // await login(email.value, password.value); //TODO: need to implement resetPassword function in useResetpassword and implement it here await resetPassword({password: password, password2: password2, contactId: contactId, hash: hash});
};
</script>
