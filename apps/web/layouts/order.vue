<template>
  <UiNavbarTop />
  <main>
    <NarrowContainer>
      <slot />
    </NarrowContainer>
  </main>
  <NuxtLazyHydrate when-visible>
    <FooterBlock v-if="runtimeConfig.public.isDev && !route.meta.isBlockified" />
    <UiFooter v-if="!runtimeConfig.public.isDev" />
  </NuxtLazyHydrate>
</template>
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
</script>
