<template>
  <div v-if="showComponent" :class="['flex flex-col md:flex-row items-center', positionClass]">
    <div v-if="image" :class="['w-full', 'md:w-1/2', { 'mb-4': text }]">
      <nuxt-img :src="image" alt="Media Image" width="728" height="485" class="w-full h-auto object-cover" />
    </div>

    <div v-if="text" :class="['w-full', 'md:w-1/2', 'md:pl-8', { 'text-center': !image }]" v-html="text"></div>
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

const positionClass = computed(() => (props.alignment === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'));
</script>
