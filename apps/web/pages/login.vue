<template>
  <NuxtLayout name="auth" :heading="''">
    <LoginComponent v-if="isLogin" @change-view="isLogin = false" @logged-in="navigateAfterAuth" />
    <Register v-else @change-view="isLogin = true" @registered="navigateAfterAuth" />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const router = useRouter();
const localePath = useLocalePath();
const isLogin = ref(true);

const navigateAfterAuth = () => {
  const redirectUrl = router.currentRoute.value.query.redirect as string;

  if (redirectUrl) {
    router.push(localePath(redirectUrl));
    return;
  }

  router.go(-1);
};
</script>
