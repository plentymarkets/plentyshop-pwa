<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    <div
      v-for="n in skeletonCount"
      :key="n"
      class="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-48 rounded-md"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  skeletonCount?: number;
}>();

const skeletonCount = computed(() => props.skeletonCount || 8);
</script>