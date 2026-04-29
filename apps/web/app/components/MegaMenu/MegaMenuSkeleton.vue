<template>
  <li
    v-for="item in items"
    :key="item.id"
    class="inline-flex items-center py-2 px-4 mr-2 rounded-md animate-pulse h-10"
    aria-hidden="true"
  >
    <span :class="['block h-6 rounded bg-gray-300', item.width]" />
  </li>
</template>

<script setup lang="ts">
const items = [
  { id: 1, width: 'w-20' },
  { id: 2, width: 'w-28' },
];
</script>
