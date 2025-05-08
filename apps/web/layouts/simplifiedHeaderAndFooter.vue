<template>
  <div>
    <UiSimplifiedHeader />
    <main>
      <slot />
    </main>
    <LazyCookiebar hydrate-on-visible />
    <LazyPreviewMode hydrate-on-visible />
    <LazyUiFooter hydrate-on-visible :simplified-footer="true" />
  </div>
</template>

<script setup lang="ts">
usePageTitle();
useStructuredData().setLogoMeta();
</script>
