<template>
  <div v-if="showComponent" :class="['flex flex-col md:flex-row items-center', positionClass]">
    <div v-if="text" :class="['w-full', { 'mb-4': image }]" v-html="text"></div>

    <div
      v-if="image"
      :class="['w-full', 'md:w-1/2', 'h-auto', { 'md:order-1': alignment === 'right', 'md:order-2': alignment === 'left' }]"
    >
      <img :src="image" alt="Media Image" class="w-full h-auto object-cover" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  image: {
    type: String,
    default: null,
  },
  text: {
    type: String,
    default: null,
  },
  alignment: {
    type: String,
    default: 'left',
    validator: (value: string) => ['left', 'right'].includes(value),
  },
});

const showComponent = computed(() => props.image || props.text);

const positionClass = computed(() =>
  props.alignment === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
);
</script>
