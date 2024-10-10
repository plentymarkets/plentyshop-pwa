<template>
  <div v-if="showComponent" :class="['flex flex-col md:flex-row items-center', positionClass]">
    <div v-if="image && image.trim() !== ''" :class="['w-full', 'md:w-1/2', { 'mb-4': text }]">
      <img :src="image" alt="Media Image" width="728" height="485" class="w-full h-auto object-cover" />
    </div>

    <div v-if="text && text.trim() !== ''" :class="['w-full', textWidthClass, textAlignmentClass]" v-html="text"></div>
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

const showComponent = computed(() => {
  return (props.image && props.image.trim() !== '') || (props.text && props.text.trim() !== '');
});

const textWidthClass = computed(() => {
  return !props.image || props.image.trim() === '' ? 'w-full' : 'md:w-1/2';
});
const positionClass = computed(() => (props.alignment === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'));
const textAlignmentClass = computed(() => (!props.image || props.image.trim() === '' ? 'text-center' : ''));
</script>
