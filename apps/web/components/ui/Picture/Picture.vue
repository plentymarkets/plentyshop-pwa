<template>
  <picture>
    <source v-for="source in sourcesWithSizes" :sizes="source.sizes" :srcset="source.srcset" :type="'image/' + source.format" />
    <img :class="cssClass" :height="height" :width="width" :src="src" :sizes="srcWithSize.sizes" :srcset="srcWithSize.srcset"  :alt="alt" />
  </picture>
</template>
<script setup lang="ts">
import { PictureProps } from './types';
const props = defineProps<PictureProps>();

const { getSizes, options } = useImage();

const sourcesWithSizes = props.sources?.map((source: { srcset: string, format: string }) => {

  const { srcset, sizes } = getSizes(source.srcset, {
    sizes: options.screens,
    modifiers: { format: source.format },
  });
  
  return {
    ...source,
   srcset,
   sizes: sizes
  };
});

const srcWithSize = getSizes(props.src, {
    sizes: options.screens,
});
</script>
