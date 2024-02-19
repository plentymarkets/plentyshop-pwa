<template>
  <div>
    <ul v-if="tags && tags.length > 0" class="flex flex-row flex-wrap">
      <li v-for="(tag, index) in tags" :key="index">
        <p
          class="border rounded-xl inline-block text-center px-1 text-xs shadow-md"
          :class="tagGetters.getTagTextColorIsDark(tagGetters.getTags(product)[index]) ? 'text-dark' : 'text-white'"
          :style="{
            backgroundColor: tagGetters.getTagBackgroundColor(tagGetters.getTags(product)[index]) || undefined,
          }"
        >
          {{ tagGetters.getTagName(tagGetters.getTags(product)[index]) }}
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
