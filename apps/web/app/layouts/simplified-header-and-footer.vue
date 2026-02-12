<template>
  <div>
    <UiHeader />
    <main>
      <slot />
    </main>
    <NuxtLazyHydrate when-idle>
      <Cookiebar />
      <PreviewMode />
    </NuxtLazyHydrate>
    <UiFooterBlocks />
  </div>
</template>

<script setup lang="ts">
usePageTitle();
useStructuredData().setLogoMeta();
</script>
