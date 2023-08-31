<template>
  <div class="flex items-center justify-center my-5">
    <form @submit.prevent="loginUser" class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-400">
      <div class="text-lg font-medium">
        {{ $t('auth.login.heading') }}
      </div>
      <label>
        <UiFormLabel>{{ $t('form.emailLabel') }}</UiFormLabel>
        <SfInput name="email" type="email" autocomplete="email" v-model="email" required />
      </label>

      <label>
        <UiFormLabel>{{ $t('form.passwordLabel') }}</UiFormLabel>
        <UiFormPasswordInput name="password" autocomplete="current-password" v-model="password" required />
      </label>

      <!-- <label class="mt-2 flex items-center gap-2">
        <SfCheckbox name="rememberMe" v-model="rememberMe" />
        {{ $t('auth.login.rememberMeLabel') }}
      </label> -->

      <SfButton type="submit" class="mt-2" :disabled="isLoading">
        <SfLoaderCircular v-if="isLoading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ $t('auth.login.submitLabel') }}
        </span>
      </SfButton>
      <div align="center">
        <!-- <SfLink class="mt-2" :tag="NuxtLink" to="/reset-password" variant="primary">
          {{ $t('auth.login.forgotPasswordLabel') }}
        </SfLink> -->
        <div class="my-5 font-bold">{{ $t('auth.login.createAccount') }}</div>
        <SfLink :tag="NuxtLink" :to="paths.authSignup" variant="primary">
          {{ $t('auth.login.createAccountLinkLabel') }}
        </SfLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfButton, SfLink, SfInput, SfLoaderCircular } from '@storefront-ui/vue';
import { useCustomer } from '~/composables/useCustomer';

const { login } = useCustomer();

definePageMeta({
  layout: false,
});

const NuxtLink = resolveComponent('NuxtLink');

const router = useRouter();
const email = ref('');
const password = ref('');
// const rememberMe = ref<boolean>();
const isLoading = ref<boolean>();

const loginUser = () => {
  // isLoading.value = true;
  login(email.value, password.value);
  // mimics waiting an async api call
  router.push('/');
};
</script>
