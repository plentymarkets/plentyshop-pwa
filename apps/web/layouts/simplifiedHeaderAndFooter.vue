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
      <FooterBlock v-if="runtimeConfig.public.isDev && !route.meta.isBlockified" />
      <UiFooter v-if="!runtimeConfig.public.isDev" />
    </NuxtLazyHydrate>
  </div>
</template>

<script setup lang="ts">
import FooterBlock from '~/components/blocks/Footer/Footer.vue';

const runtimeConfig = useRuntimeConfig();
const route = useRoute();

usePageTitle();
useStructuredData().setLogoMeta();
</script>
