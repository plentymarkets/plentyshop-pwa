<template>
  <div v-if="tags && tags.length > 0" data-testid="tags">
    <ul class="flex flex-row flex-wrap gap-1">
      <li v-for="(tag, index) in tags" :key="index">
        <p
          @click="onTagClick(tag)"
          class="border rounded-xl inline-block text-center py-1 px-2 text-xs cursor-pointer"
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
import { ProductTag } from '@plentymarkets/shop-api';

const { product } = withDefaults(defineProps<TagsProps>(), {});
const localePath = useLocalePath();

const onTagClick = (tag: ProductTag) => {
  navigateTo(localePath(`/tag/${tagGetters.getTagName(tag)}`));
};

const tags = tagGetters.getTags(product);
</script>
