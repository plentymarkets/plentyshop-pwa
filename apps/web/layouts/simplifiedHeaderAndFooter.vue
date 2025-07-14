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
    <FooterBlock v-if="!route.meta.isBlockified" />
  </div>
</template>

<script setup lang="ts">
import FooterBlock from '~/components/blocks/Footer/Footer.vue';

definePageMeta({
  isBlockified: false,
});
const route = useRoute();

usePageTitle();
useStructuredData().setLogoMeta();
</script>
