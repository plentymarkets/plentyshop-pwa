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
    <ClientOnly>
      <FooterBlock v-if="!route.meta.isBlockified" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import FooterBlock from '~/components/blocks/Footer/Footer.vue';

const route = useRoute();

usePageTitle();
useStructuredData().setLogoMeta();
</script>
