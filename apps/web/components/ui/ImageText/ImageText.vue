<template>
  <div v-if="showComponent" :class="['flex flex-col md:flex-row items-center', positionClass]">
    <div :class="['w-full', 'md:w-1/2']">
      <img :src="props.image?.imageLink" :alt="props.image?.imageLink" width="728" height="485" class="w-full h-auto object-cover" />
    </div>

    <TextContent :text="props.text" :button="props.button"/>
  </div>
</template>

<script setup lang="ts">

import type { ImageTextProps } from '~/components/ui/ImageText/types';

const props = defineProps<ImageTextProps>();



const showComponent = computed(() => {
  return props.image || props.text;
});

const positionClass = computed(() => (props.image?.imageAlignment === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'));
</script>