<template>
  <form @submit.prevent="submitChangePassword" data-testid="account-forms-password">
    <label class="block">
      <UiFormLabel>{{ $t('account.accountSettings.personalData.currentPassword') }}</UiFormLabel>
      <SfInput
        name="password"
        :type="passwordVisible ? 'text' : 'password'"
        v-model="userPasswords.oldPassword"
        required
      >
        <template #suffix>
          <button type="button" @click="passwordVisible = !passwordVisible">
            <SfIconVisibility />
          </button>
        </template>
      </SfInput>
    </label>
    <label class="block my-4">
      <UiFormLabel>{{ $t('account.accountSettings.personalData.newPassword') }}</UiFormLabel>
      <SfInput
        name="password"
        :type="firstNewPasswordVisible ? 'text' : 'password'"
        v-model="userPasswords.firstNewPassword"
        required
        minlength="8"
      >
        <template #suffix>
          <button type="button" @click="firstNewPasswordVisible = !firstNewPasswordVisible">
            <SfIconVisibility />
          </button>
        </template>
      </SfInput>
      <UiFormHelperText class="block"> {{ $t('account.accountSettings.personalData.passwordHelp') }}</UiFormHelperText>
    </label>
    <label class="block">
      <UiFormLabel>{{ $t('account.accountSettings.personalData.newPasswordAgain') }}</UiFormLabel>
      <SfInput
        name="password"
        :type="secondNewPasswordVisible ? 'text' : 'password'"
        v-model="userPasswords.secondNewPassword"
        required
        minlength="8"
      >
        <template #suffix>
          <button type="button" @click="secondNewPasswordVisible = !secondNewPasswordVisible">
            <SfIconVisibility />
          </button>
        </template>
      </SfInput>
    </label>
    <div class="mt-6 flex flex-col-reverse md:flex-row md:justify-end gap-4">
      <SfButton type="reset" variant="secondary" @click="$emit('on-cancel')">
        {{ $t('contactInfo.cancel') }}
      </SfButton>
      <SfButton type="submit" class="min-w-[120px]" :disabled="loading">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ $t('account.accountSettings.personalData.changePassword') }}
        </span>
      </SfButton>
    </div>
  </form>
</template>
<script lang="ts" setup>
import { SfButton, SfInput, SfIconVisibility, SfLoaderCircular } from '@storefront-ui/vue';
import type { AccountFormsPasswordProps } from '~/components/AccountForms/types';

const { send } = useNotification();
const { loading, changePassword } = useCustomer();
const i18n = useI18n();

const props = defineProps<AccountFormsPasswordProps>();
const { oldPassword, firstNewPassword, secondNewPassword } = toRefs(props);
const emits = defineEmits(['on-save', 'on-cancel']);
const userPasswords = ref({
  oldPassword: oldPassword?.value ?? '',
  firstNewPassword: firstNewPassword?.value ?? '',
  secondNewPassword: secondNewPassword?.value ?? '',
});

const passwordVisible = ref(false);
const firstNewPasswordVisible = ref(false);
const secondNewPasswordVisible = ref(false);

const submitChangePassword = async () => {
  if (userPasswords.value.firstNewPassword !== userPasswords.value.secondNewPassword) {
    send({
      type: 'negative',
      message: i18n.t('account.accountSettings.personalData.passwordsDoNotMatch'),
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
