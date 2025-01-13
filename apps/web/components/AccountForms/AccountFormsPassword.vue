<template>
  <form data-testid="account-forms-password" @submit.prevent="submitChangePassword">
    <label class="block">
      <UiFormLabel
        >{{ t('account.accountSettings.personalData.currentPassword') }} {{ $t('form.required') }}</UiFormLabel
      >
      <UiFormPasswordInput
        v-model="userPasswords.oldPassword"
        name="password"
        autocomplete="current-password"
        required
      />
    </label>
    <label class="block my-4">
      <UiFormLabel>{{ t('account.accountSettings.personalData.newPassword') }} {{ $t('form.required') }}</UiFormLabel>
      <UiFormPasswordInput
        v-model="userPasswords.firstNewPassword"
        name="password"
        autocomplete="new-password"
        required
        minlength="8"
        pattern="^(?=.*[A-Za-z])(?=.*\d)\S{8,}$"
      />
      <UiFormHelperText class="block"> {{ t('account.accountSettings.personalData.passwordHelp') }}</UiFormHelperText>
    </label>
    <label class="block">
      <UiFormLabel
        >{{ t('account.accountSettings.personalData.newPasswordAgain') }} {{ $t('form.required') }}</UiFormLabel
      >
      <UiFormPasswordInput
        v-model="userPasswords.secondNewPassword"
        name="password"
        autocomplete="new-password"
        required
        minlength="8"
        pattern="^(?=.*[A-Za-z])(?=.*\d)\S{8,}$"
      />
    </label>
    <div class="mt-6 flex flex-col-reverse md:flex-row md:justify-end gap-4">
      <UiButton type="reset" variant="secondary" @click="$emit('on-cancel')">
        {{ t('contactInfo.cancel') }}
      </UiButton>
      <UiButton type="submit" class="min-w-[120px]" :disabled="loading">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ t('account.accountSettings.personalData.changePassword') }}
        </span>
      </UiButton>
    </div>
  </form>
</template>
<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { AccountFormsPasswordProps } from '~/components/AccountForms/types';

const { send } = useNotification();
const { loading, changePassword } = useCustomer();
const { t } = useI18n();

const props = defineProps<AccountFormsPasswordProps>();
const { oldPassword, firstNewPassword, secondNewPassword } = toRefs(props);
const emits = defineEmits(['on-save', 'on-cancel']);
const userPasswords = ref({
  oldPassword: oldPassword?.value ?? '',
  firstNewPassword: firstNewPassword?.value ?? '',
  secondNewPassword: secondNewPassword?.value ?? '',
});

const submitChangePassword = async () => {
  if (userPasswords.value.firstNewPassword !== userPasswords.value.secondNewPassword) {
    send({
      type: 'negative',
      message: t('account.accountSettings.personalData.passwordsDoNotMatch'),
    });
    return;
  }

  const success = await changePassword({
    oldPassword: userPasswords.value.oldPassword,
    password: userPasswords.value.firstNewPassword,
    password2: userPasswords.value.secondNewPassword,
  });

  if (success) {
    emits('on-save');
  }
};
</script>
