<template>
  <Body class="font-body" />
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { getCategoryTree } = useCategoryTree();
const { setInitialData } = useInitialSetup();
const route = useRoute();

if (route.layoutName !== 'checkout') {
  setInitialData();
}

getCategoryTree();
usePageTitle();
</script>
