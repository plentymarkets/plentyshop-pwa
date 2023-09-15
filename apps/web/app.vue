<template>
  <Body class="font-body" :class="bodyClass" />
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { getCategoryTree } = useCategoryTree();
const { setInitialData } = useInitialSetup();
const route = useRoute();

if (route?.meta.layoutName !== 'checkout') {
  setInitialData();
}

getCategoryTree();
usePageTitle();

const bodyClass = ref('');
onMounted(() => {
  // Need this class for cypress testing
  bodyClass.value = 'hydrated';
});
</script>
