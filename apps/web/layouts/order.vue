<template>
  <UiNavbarTop />
  <main>
    <NarrowContainer>
      <slot />
    </NarrowContainer>
  </main>
  <UiFooter v-if="isStaticPage" />
</template>
<script setup lang="ts">
definePageMeta({
  pageType: 'static',
});
const route = useRoute();
const isStaticPage = computed(() => route.meta.pageType === 'static');
</script>
