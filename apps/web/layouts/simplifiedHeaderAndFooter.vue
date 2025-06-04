<template>
  <div>
    <UiSimplifiedHeader />
    <main>
      <slot />
    </main>
    <NuxtLazyHydrate when-idle>
      <Cookiebar />
      <PreviewMode />
    </NuxtLazyHydrate>
    <NuxtLazyHydrate when-visible>
      <UiFooter v-if="route.meta.isBlockified" :simplified-footer="true" />
    </NuxtLazyHydrate>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  isBlockified: false,
});
const route = useRoute();
usePageTitle();
useStructuredData().setLogoMeta();
</script>
