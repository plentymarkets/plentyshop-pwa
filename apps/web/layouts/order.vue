<template>
  <UiNavbarTop />
  <main>
    <NarrowContainer>
      <slot />
    </NarrowContainer>
  </main>
  <NuxtLazyHydrate when-visible>
    <FooterBlock v-if="!route.meta.isBlockified" />
  </NuxtLazyHydrate>
</template>
<script setup lang="ts">
import FooterBlock from '~/components/blocks/Footer/Footer.vue';

const route = useRoute();
</script>
