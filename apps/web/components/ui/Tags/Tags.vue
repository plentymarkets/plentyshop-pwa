<template>
  <div>
    <ul v-if="tags && tags.length > 0" class="flex flex-row flex-wrap">
      <li v-for="(tag, index) in tags" :key="index">
        <p class="border rounded-xl inline-block text-center px-1 text-xs shadow-md" 
        :class="isDarkText[index] ? 'text-white' : 'text-dark'" 
        :style="{ backgroundColor: tag.color || undefined}">
          {{ tag.names.name }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { productTagsGetters } from '@plentymarkets/shop-sdk';
import type { TagsProps } from '~/components/ui/Tags/types';

const { product } = withDefaults(defineProps<TagsProps>(), {});

const tags = productTagsGetters.getTags(product);
const isDarkText = productTagsGetters.getTagsTextColor(product);
</script>
