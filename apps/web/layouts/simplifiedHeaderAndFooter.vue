<template>
  <div>
    <UiSimplifiedHeader />
    <main>
      <slot />
    </main>
    <NuxtLazyHydrate when-idle>
      <ClientOnly><Cookiebar /></ClientOnly>
      <PreviewMode />
    </NuxtLazyHydrate>
    <NuxtLazyHydrate when-visible>
      <UiFooter :simplified-footer="true" />
    </NuxtLazyHydrate>
  </div>
</template>

<script setup lang="ts">
usePageTitle();
useStructuredData().setLogoMeta();
</script>
