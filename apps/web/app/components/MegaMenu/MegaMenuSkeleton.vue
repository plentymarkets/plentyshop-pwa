<template>
  <div class="flex flex-wrap px-6 py-2 bg-white border-b border-b-neutral-200 border-b-solid" aria-hidden="true">
    <div
      v-for="item in items"
      :key="item.id"
      class="inline-flex items-center py-2 px-4 mr-2 rounded-md animate-pulse"
    >
      <span :class="['block h-6 rounded bg-gray-300', item.width]" />
    </div>
  </div>
</template>

<script setup lang="ts">
const items = [
  { id: 1, width: 'w-20' },
  { id: 2, width: 'w-28' },
  { id: 3, width: 'w-16' },
  { id: 4, width: 'w-24' },
  { id: 5, width: 'w-20' },
];
</script>
