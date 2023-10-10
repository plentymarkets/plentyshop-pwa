<template>
  <NuxtLayout name="login">
    <div class="text-lg text-center mt-2 font-medium">
      {{ $t('auth.login.heading') }}
    </div>
    <login @logged-in="returnToPreviousPage" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const returnToPreviousPage = () => {
  router.go(-1);
};
</script>
