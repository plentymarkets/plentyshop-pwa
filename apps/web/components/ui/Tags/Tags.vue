<template>
  <div data-testid="tags">
    <ul v-if="tags && tags.length > 0" class="flex flex-row flex-wrap">
      <li v-for="(tag, index) in tags" :key="index">
        <p
          class="border rounded-xl inline-block text-center py-1 px-2 text-xs shadow-md"
          :class="tagGetters.getTagTextColorIsDark(tag) ? 'text-dark' : 'text-white'"
          :style="{
            backgroundColor: tagGetters.getTagBackgroundColor(tag) || 'bg-white',
          }"
        >
          {{ tagGetters.getTagName(tag) }}
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
