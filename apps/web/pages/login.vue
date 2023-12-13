<template>
  <NuxtLayout name="auth" :heading="''">
    <div class="text-lg text-center font-medium">
      {{ $t('auth.login.heading') }}
    </div>
    <LoginComponent @logged-in="returnToPreviousPage" />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

import { useRouter } from 'vue-router';
const router = useRouter();
const returnToPreviousPage = () => {
  router.go(-1);
};
</script>
