<template>
  <NuxtLayout name="auth" :heading="$t('auth.resetPassword.heading')">
    <form class="pb-4 md:p-6 mt-10 md:border md:border-neutral-200 rounded-md" @submit.prevent="resetPassword">
      <p class="mb-6">
        {{ $t('auth.resetPassword.info') }}
      </p>
      <label>
        <UiFormLabel>{{ $t('auth.resetPassword.email') }} {{ $t('form.required') }}</UiFormLabel>
        <SfInput name="email" type="email" v-model="customerEmail" required />
      </label>
      <div class="mt-6 flex flex-col-reverse md:flex-row gap-4">
        <SfButton :tag="NuxtLink" :to="localePath(paths.authLogin)" class="flex-1" variant="tertiary">
          {{ $t('auth.resetPassword.backToLogin') }}
        </SfButton>
        <SfButton type="submit" class="flex-1"> {{ $t('auth.resetPassword.continue') }} </SfButton>
      </div>
    </form>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SfButton, SfInput } from '@storefront-ui/vue';

const localePath = useLocalePath();

definePageMeta({
  layout: false,
});

const customerEmail = ref('');
const resetPassword = () => navigateTo(localePath(paths.authResetPasswordSuccess));
const NuxtLink = resolveComponent('NuxtLink');
</script>
