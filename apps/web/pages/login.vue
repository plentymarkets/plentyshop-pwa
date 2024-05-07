<template>
  <NuxtLayout name="auth" :heading="''">
    <LoginComponent v-if="isLogin" @change-view="isLogin = false" @logged-in="returnToPreviousPage" />
    <Register v-else @change-view="isLogin = true" @registered="returnToPreviousPage" />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const router = useRouter();
const returnToPreviousPage = () => {
  router.go(-1);
};

const isLogin = ref(true);
</script>
