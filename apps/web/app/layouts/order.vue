<template>
  <UiNavbarTop />
  <main>
    <NarrowContainer>
      <slot />
    </NarrowContainer>
  </main>
  <FooterBlock />
</template>
<script setup lang="ts">
import FooterBlock from '~/components/blocks/Footer/Footer.vue';
</script>
