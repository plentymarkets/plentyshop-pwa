<template>
  <table class="w-full text-left">
    <tbody>
      <tr v-for="row in rows" :key="row.key">
        <th scope="row" class="@lg:py-3 py-2 @lg:pr-4 pr-2 align-top text-sm font-normal text-left">
          {{ row.label }}
        </th>
        <td class="@lg:py-3 py-2 align-top text-sm">
          {{ row.value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { ItemDataTableProps } from './types';

defineProps<ItemDataTableProps>();
</script>
