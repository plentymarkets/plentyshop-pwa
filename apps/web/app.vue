<template>
  <Body class="font-body" />
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
usePageTitle();

const { getCategoryTree } = useCategoryTree();
const { getCart } = useCart();
const { getSession } = useCustomer();

getCategoryTree();
getCart();
getSession();
usePageTitle();
</script>
