<template>
  <UiNavbarTop />
  <main>
    <NarrowContainer>
      <slot />
    </NarrowContainer>
  </main>
  <ClientOnly>
    <FooterBlock v-if="!route.meta.isBlockified" />
  </ClientOnly>
</template>
<script setup lang="ts">
import FooterBlock from '~/components/blocks/Footer/Footer.vue';

const route = useRoute();
</script>
