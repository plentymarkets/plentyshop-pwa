<template>
  <div class="relative w-full border rounded overflow-hidden min-h-[400px] flex flex-col bg-gray-50">
    <div class="flex justify-between items-center p-4 ">
      <div class="text-sm text-gray-700">
        <strong>{{ props.name }}</strong>
        <span v-if="props.dimensions" class="ml-2 text-gray-500">({{ props.dimensions }})</span>
      </div>
      <button class="text-gray-500 hover:text-gray-700 text-xl leading-none" @click="close">
        &times;
      </button>
    </div>

    <div class="flex-1 flex items-center justify-center p-4">
      <template v-if="props.image">
        <img :src="props.image" alt="Preview" class="max-w-full max-h-[600px] object-contain rounded-md" />
      </template>
      <template v-else>
        <span class="text-gray-400">Select an image from the list to preview it here</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  image: string | null
  name: string
  dimensions?: string
}>()
const emit = defineEmits(['close']);
const close = () => emit('close');

</script>
