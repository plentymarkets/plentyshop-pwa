<template>
  <UiNavbarTop />
  <main>
    <NarrowContainer>
      <slot />
    </NarrowContainer>
  </main>
  <UiFooter v-if="route.meta.isBlockified" />
</template>
<script setup lang="ts">
definePageMeta({
  isBlockified: false,
});
const route = useRoute();
</script>
