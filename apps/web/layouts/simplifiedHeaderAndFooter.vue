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
      <UiFooter v-if="isStaticPage" :simplified-footer="true" />
    </NuxtLazyHydrate>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  pageType: 'static',
});
const route = useRoute();
const isStaticPage = computed(() => route.meta.pageType === 'static');
usePageTitle();
useStructuredData().setLogoMeta();
</script>
