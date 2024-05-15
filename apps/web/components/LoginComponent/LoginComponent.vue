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

      <SfButton type="submit" class="mt-2" :disabled="loading">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ t('auth.login.submitLabel') }}
        </span>
      </SfButton>
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
import { AddressType } from '@plentymarkets/shop-api';
import { SfButton, SfLink, SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import type { LoginProps } from './types';

const { getAddresses: getBillingAddresses } = useAddress(AddressType.Billing);
const { getAddresses: getShippingAddresses } = useAddress(AddressType.Shipping);
const { getShippingMethods } = useCartShippingMethods();

const { login, loading, getSession } = useCustomer();
const { send } = useNotification();
const { t } = useI18n();

const props = withDefaults(defineProps<LoginProps>(), {
  isSoftLogin: false,
  isModal: false,
});
const emits = defineEmits(['loggedIn', 'change-view']);

const loadAddresses = async () => {
  await getBillingAddresses();
  await getShippingAddresses();
  await getShippingMethods();
};

const email = ref('');
const password = ref('');

const loginUser = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    send({ message: t('auth.login.success'), type: 'positive' });
    emits('loggedIn');
    if (!props.isSoftLogin) {
      const currentURL = window.location.href;
      if (currentURL.includes(paths.checkout)) {
        await loadAddresses();
        await getSession();
      }
    }
  }
};
</script>
