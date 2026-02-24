<template>
  <UiNavbarTop />
  <main>
    <NarrowContainer>
      <slot />
    </NarrowContainer>
  </main>
  <EditableBlocks v-if="!$route.meta.isBlockified" :render-only="['Footer']" minimal />
</template>
<script setup lang="ts"></script>
