<template>
  <UiNavbarTop />
  <main>
    <NarrowContainer class="px-4 @md:px-6">
      <slot />
    </NarrowContainer>
  </main>
  <UiFooterBlocks />
</template>
<script setup lang="ts"></script>
