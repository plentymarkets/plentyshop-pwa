<template>
  <div>
    <ul v-if="tags && tags.length > 0" class="flex flex-row flex-wrap">
      <li v-for="(tag, index) in tags" :key="index">
        <p class="border rounded-xl inline-block text-center px-1 text-xs shadow-md" 
        :class="tagGetters.getTagsTextColor(tagGetters.getTags(product)[index]) ? 'text-white' : 'text-dark'" 
        :style="{ backgroundColor: tagGetters.getTagsBackgroundColor(tagGetters.getTags(product)[index]) || undefined}">
          {{ tagGetters.getTagsName(tagGetters.getTags(product)[index]) }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { tagGetters } from '@plentymarkets/shop-sdk';
import type { TagsProps } from '~/components/ui/Tags/types';

const { product } = withDefaults(defineProps<TagsProps>(), {});

const tags = tagGetters.getTags(product);
</script>
