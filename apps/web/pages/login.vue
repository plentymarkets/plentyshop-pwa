<template>
  <NuxtLayout name="auth" :heading="''">
    <div class="text-lg text-center font-medium">
      <span v-if="isLogin">{{ $t('auth.login.heading') }}</span>
      <span v-else>{{ $t('auth.signup.heading') }}</span>
    </div>

    <LoginComponent v-if="isLogin" @change-view="isLogin = false" @logged-in="returnToPreviousPage" />
    <Register v-else @change-view="isLogin = true" @registered="returnToPreviousPage" />
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

const isLogin = ref(true);
</script>
