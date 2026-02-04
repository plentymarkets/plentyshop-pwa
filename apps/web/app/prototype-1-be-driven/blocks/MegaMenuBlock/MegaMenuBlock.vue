<template>
  <MegaMenu :categories="categoryTree" data-testid="megamenu-block">
    <slot />
  </MegaMenu>
</template>

<script setup lang="ts">
const { data: categoryTree } = useCategoryTree();
</script>
