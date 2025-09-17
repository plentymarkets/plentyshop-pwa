<template>
  <NuxtLayout name="auth" :heading="t('auth.setNewPassword.heading')">
    <form class="pb-4 md:p-6 mt-10 md:border md:border-neutral-200 rounded-md" @submit.prevent="executeResetPassword">
      <p class="mb-6">
        {{ t('auth.setNewPassword.description') }}
      </p>
      <label class="block mb-4">
        <UiFormLabel>{{ t('auth.setNewPassword.password') }} {{ t('form.required') }}</UiFormLabel>
        <UiFormPasswordInput v-model="password" name="password" autocomplete="current-password" required />
        <UiFormHelperText>{{ t('auth.setNewPassword.help') }}</UiFormHelperText>
      </label>
      <label>
        <UiFormLabel>{{ t('auth.setNewPassword.repeatPassword') }} {{ t('form.required') }}</UiFormLabel>
        <UiFormPasswordInput v-model="password2" name="repeatedPassword" autocomplete="current-password" required />
        <p v-if="password2 && !passwordsMatch" class="text-red-500 text-sm">
          {{ t('auth.setNewPassword.passwordsNotMatching') }}
        </p>
      </label>

      <div class="text-center mt-6">
        <UiButton type="submit" class="w-1/2" :disabled="loading">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
          <span v-else>
            {{ t('auth.setNewPassword.button') }}
          </span>
        </UiButton>
      </div>

      <div class="text-center mt-2">
        <span class="my-5 mr-1">{{ t('auth.setNewPassword.rememberPassword') }}</span>
        <SfLink variant="primary" class="cursor-pointer" @click="openAuthentication">
          {{ t('account.navBottomHeadingLogin') }}
        </SfLink>
      </div>
    </form>

    <UiModal
      v-if="isAuthenticationOpen"
      v-model="isAuthenticationOpen"
      tag="section"
      class="h-full md:w-[500px] md:h-fit m-0 p-0 overflow-y-auto"
    >
      <header>
        <UiButton
          :aria-label="t('closeDialog')"
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          @click="closeAuthentication"
        >
          <SfIconClose />
        </UiButton>
      </header>
      <LoginComponent :is-soft-login="true" :is-modal="true" @logged-in="navigateAfterAuth" />
    </UiModal>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import type { ApiError } from '@plentymarkets/shop-api';
import { SfLink, SfLoaderCircular, useDisclosure, SfIconClose } from '@storefront-ui/vue';

const { resetPassword, loading } = useResetPassword();
const { t } = useI18n();
const route = useRoute();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const localePath = useLocalePath();
const { send } = useNotification();
const { fetchSession } = useFetchSession();

const passwordsMatch = computed(() => password.value === password2.value);
const password = ref('');
const password2 = ref('');
const hash = route.params.hash as string;
const contactId = Number(route.params.contactId);

definePageMeta({
  layout: false,
});

const navigateAfterAuth = () => {
  closeAuthentication();
  window.location.href = localePath(paths.home);
};

const executeResetPassword = async () => {
  if (passwordsMatch.value) {
    try {
      await resetPassword({
        password: password.value,
        password2: password2.value,
        hash: hash,
        contactId: contactId,
      });
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      await fetchSession();
      send({ message: t('auth.setNewPassword.resetSucceded'), type: 'positive' });
      await navigateTo(localePath(paths.home));
    }
  }
};
</script>
