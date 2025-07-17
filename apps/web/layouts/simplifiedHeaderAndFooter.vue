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
      <FooterBlock v-if="!route.meta.isBlockified" />
    </NuxtLazyHydrate>
  </div>
</template>

<script setup lang="ts">
import FooterBlock from '~/components/blocks/Footer/Footer.vue';

const route = useRoute();

usePageTitle();
useStructuredData().setLogoMeta();
</script>
