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

getCategoryTree();
setInitialData();
usePageTitle();
</script>
