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
    <FooterBlock />
  </div>
</template>

<script setup lang="ts">
import FooterBlock from '~/components/blocks/Footer/Footer.vue';
usePageTitle();
useStructuredData().setLogoMeta();
</script>
