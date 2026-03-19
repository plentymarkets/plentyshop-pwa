<template>
  <div class="flex flex-wrap px-6 py-2 bg-white border-b border-b-neutral-200 border-b-solid h-[57px]" aria-hidden="true">
    <div v-for="item in items" :key="item.id" aria-hidden="true">
      <div :class="['inline-flex items-center justify-center gap-2 font-medium text-base rounded-md py-2 px-4 group mr-2 bg-gray-200 animate-pulse h-[40px]', item.width]" />
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
