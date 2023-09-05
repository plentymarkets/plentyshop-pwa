<template>
  <div class="flex items-center justify-center my-1">
    <form @submit.prevent="registerUser" class="flex flex-col gap-4 p-2 md:p-6 rounded-md w-full md:w-[400px]">
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

      <SfButton type="submit" class="mt-2" :disabled="loading">
        <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
        <span v-else>
          {{ $t('auth.signup.submitLabel') }}
        </span>
      </SfButton>
      <div align="center">
        <!-- <SfLink class="mt-2" :tag="NuxtLink" to="/reset-password" variant="primary">
          {{ $t('auth.login.forgotPasswordLabel') }}
        </SfLink> -->
        <div class="my-5 font-bold">{{ $t('auth.signup.alreadyHaveAccount') }}</div>
        <SfLink @click="$emit('change-view')" href="#" variant="primary">
          {{ $t('auth.signup.logInLinkLabel') }}
        </SfLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfButton, SfLink, SfInput, SfLoaderCircular } from '@storefront-ui/vue';

const { register, loading } = useCustomer();
const { send } = useNotification();

definePageMeta({
  layout: false,
});
const emits = defineEmits(['registered', 'change-view']);

const NuxtLink = resolveComponent('NuxtLink');
const router = useRouter();
const email = ref('');
const password = ref('');
// const rememberMe = ref<boolean>();

const registerUser = async () => {
  await register({ email: email.value, password: password.value });

  send({
    message: 'Registered successfully',
    type: 'positive',
    persist: true,
    action: {
      text: 'action',
      onClick: () => {},
    },
  });

  emits('registered');
  router.push('/');
};
</script>
