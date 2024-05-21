<template>
  <ClientOnly>
    <div class="relative col-span-4">
      <WishlistPageContent :with-header="false" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'account',
  pageType: 'static',
});
</script>
