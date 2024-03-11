<template>
  <div v-if="tags.length > 0" data-testid="tags">
    <ul class="flex flex-row flex-wrap gap-2">
      <SfListItem
        v-for="(tag, index) in tags"
        :key="index"
        :id="tag.id"
        size="sm"
        :class="tagGetters.getTagTextColorIsDark(tag) ? 'text-dark' : 'text-white'"
        class="text-xs font-medium select-none rounded-md !w-fit !cursor-text opacity-75"
        :style="{ backgroundColor: tagGetters.getTagBackgroundColor(tag) }"
      >
        {{ tagGetters.getTagName(tag) }}
      </SfListItem>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { SfListItem } from '@storefront-ui/vue';
import { tagGetters } from '@plentymarkets/shop-sdk';
import type { TagsProps } from '~/components/ui/Tags/types';

const { product } = withDefaults(defineProps<TagsProps>(), {});
const tags = tagGetters.getTags(product);
</script>
