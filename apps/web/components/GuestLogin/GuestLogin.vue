<template>
  <div class="md:w-full md:flex md:justify-center">
    <div class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-full md:w-2/3">
      <div class="md:self-center">
        <h2 class="font-bold mb-6 text-lg">{{ $t('guestCheckout') }}</h2>
        <SfButton
          data-testid="guest-checkout-button"
          :tag="NuxtLink"
          :to="localePath(paths.checkout)"
          class="w-full mb-4"
        >
          {{ $t('continueAsGuest') }}
        </SfButton>
        <OrDivider />
        <div v-if="isAvailable">
          <PayPalExpressButton v-if="!loginSubmit" class="mt-4" type="CartPreview" />
          <OrDivider />
        </div>
        <div class="w-[400px] mt-4">
          <form @submit.prevent="loginUser">
            <h1 class="font-bold text-lg">{{ $t('loginFastCheckout') }}</h1>
            <label>
              <UiFormLabel class="w-full mt-4">{{ $t('form.emailLabel') }}</UiFormLabel>
              <SfInput class="w-full" name="email" type="email" autocomplete="email" v-model="email" required />
            </label>

            <label>
              <UiFormLabel class="mt-6">{{ $t('form.passwordLabel') }}</UiFormLabel>
              <UiFormPasswordInput name="password" autocomplete="current-password" v-model="password" required />
            </label>

            <SfButton type="submit" class="mt-4 w-full">
              <SfLoaderCircular v-if="loading" />
              <span>
                {{ $t('auth.login.loginAndContinue') }}
              </span>
            </SfButton>
            <div class="text-center mt-6">
              <!-- <SfLink href="#" variant="primary">
                            {{ $t('auth.login.forgotPasswordLabel') }}
                        </SfLink> -->
              <div class="mt-6">
                <h3 class="font-bold text-lg mb-6">{{ $t('auth.login.createAccount') }}</h3>
                <p>{{ $t('auth.login.createAccountLater') }}!</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfButton, SfInput, SfLoaderCircular } from '@storefront-ui/vue';

const { login, isAuthorized, loading } = useCustomer();
const { send } = useNotification();
const { isAvailable, loadConfig } = usePayPal();
const { t } = useI18n();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

const emits = defineEmits(['loggedIn', 'change-view']);

onMounted(() => {
  loadConfig();
});

const email = ref('');
const password = ref('');
let loginSubmit = false;

const loginUser = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    send({ message: t('auth.login.success'), type: 'positive' });
    emits('loggedIn');
    loginSubmit = true;
  }
};

watch(
  () => isAuthorized.value,
  (value) => {
    if (value === true) {
      navigateTo(localePath(paths.checkout));
    }
  },
);
</script>
