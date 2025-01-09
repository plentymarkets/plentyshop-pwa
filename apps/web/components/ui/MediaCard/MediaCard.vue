<template>
  <div v-if="showComponent" :class="['flex flex-col md:flex-row items-center', positionClass]">
    <div :class="['w-full', 'md:w-1/2', { 'mb-4': text }]">
      <img :src="image" :alt="alt" width="728" height="485" class="w-full h-auto object-cover" />
    </div>

    <div :class="['w-full no-preflight', textAlignmentClass]" v-html="text"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  image: {
    type: String,
    default: null,
  },
  alt: {
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

const showComponent = computed(() => {
  return props.image && props.image.trim() !== '' && props.text && props.text.trim() !== '';
});

const positionClass = computed(() => (props.alignment === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'));

const textAlignmentClass = computed(() => {
  return props.alignment === 'right' ? 'text-right' : 'text-left';
});
</script>
