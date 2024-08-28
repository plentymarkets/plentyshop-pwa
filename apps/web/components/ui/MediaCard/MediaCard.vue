<template>
  <div v-if="showComponent" :class="containerClass">
    <div v-if="image" :class="imageClass">
      <img :src="image" alt="Media Image" class="w-full h-auto object-cover" />
    </div>

    <div v-if="text" :class="textClass">
      <h2 class="text-lg font-semibold mb-2">Lorem Ipsum Dolor</h2>
      <h3 class="text-2xl font-bold mb-4">Sed do eiusmod tempor incididunt</h3>
      <p class="text-base mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation.
      </p>
      <ul class="list-disc list-inside space-y-2">
        <li>First item of the list</li>
        <li>Second item of the list</li>
        <li>Third item of the list</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  image: {
    type: String,
    default: null,
  },
  text: {
    type: Boolean,
    default: false,
  },
});
const showComponent = computed(() => props.image || props.text);

const containerClass = computed(() => {
  return props.image ? 'flex flex-col md:flex-row items-center md:items-start' : 'flex justify-center items-center';
});

const imageClass = computed(() => {
  return props.text ? 'w-full md:w-1/2 mb-4 md:mb-0' : 'w-full';
});

const textClass = computed(() => {
  return props.image ? 'w-full md:w-1/2 md:pl-8' : 'w-full text-center';
});
</script>
