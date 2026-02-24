<template>
  <UiNavbarTop />
  <main>
    <NarrowContainer>
      <slot />
    </NarrowContainer>
  </main>
  <EditablePage v-if="!$route.meta.isBlockified" :render-only="['Footer']" minimal />
</template>
<script setup lang="ts"></script>
