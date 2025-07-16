<template>
  <NuxtLayout name="checkout" :back-label-desktop="t('back')" :back-label-mobile="t('back')" :heading="t('checkout')">
    <div class="md:w-full md:flex md:justify-center">
      <div class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-full md:w-2/3 lg:w-1/2 3xl:w-2/5">
        <h2 class="font-bold text-lg">{{ t('guestCheckout') }}</h2>

        <UiButton
          data-testid="guest-checkout-button"
          :tag="NuxtLink"
          :to="localePath(paths.checkout)"
          class="w-full my-4"
        >
          {{ t('continueAsGuest') }}
        </UiButton>

        <OrDivider />

        <template v-if="loadedConfig && isAvailable">
          <PayPalExpressButton class="mt-4" type="CartPreview" />
          <PayPalPayLaterBanner placement="cart" :amount="cartGetters.getTotal(cartGetters.getTotals(cart))" />
          <OrDivider />
        </template>

        <form :class="{ 'mt-4': isAvailable }" @submit.prevent="loginUser">
          <h2 class="font-bold text-lg">{{ t('loginFastCheckout') }}</h2>

          <label>
            <UiFormLabel class="w-full mt-4">{{ t('form.emailLabel') }}</UiFormLabel>
            <SfInput v-model="email" class="w-full" name="email" type="email" autocomplete="email" required />
          </label>

          <label>
            <UiFormLabel class="mt-6">{{ t('form.passwordLabel') }}</UiFormLabel>
            <UiFormPasswordInput v-model="password" name="password" autocomplete="current-password" required />
          </label>

          <UiButton :disabled="loading || loginSubmit" type="submit" class="mt-8 w-full">
            <SfLoaderCircular v-if="loading || loginSubmit" class="flex justify-center items-center" size="base" />
            <template v-else>{{ t('auth.login.loginAndContinue') }}</template>
          </UiButton>

          <div class="text-center mt-6">
            <h3 class="font-bold text-lg mb-6">{{ t('auth.login.createAccount') }}</h3>
            <p>{{ t('auth.login.createAccountLater') }}!</p>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import { paths } from '~/utils/paths';
import { cartGetters } from '@plentymarkets/shop-api';

definePageMeta({
  pageType: 'static',
  middleware: ['guest-guard'],
});

const { login, loading } = useCustomer();
const { send } = useNotification();
const { data: cart } = useCart();
const { isAvailable, loadConfig, loadedConfig } = usePayPal();
const { t } = useI18n();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

onBeforeMount(async () => await loadConfig());

const email = ref('');
const password = ref('');
const loginSubmit = ref(false);

const loginUser = async () => {
  loginSubmit.value = true;
  await login(email.value, password.value).then((success: boolean) => {
    if (!success) {
      loginSubmit.value = false;
      return;
    }

    send({ message: t('auth.login.success'), type: 'positive' });
    navigateTo(localePath(paths.checkout));
  });
};
</script>
