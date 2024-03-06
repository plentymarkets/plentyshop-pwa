<template>
  <div data-testid="badges">
    <ul class="flex flex-row flex-wrap gap-2">
      <SfListItem
        v-if="availabilityEnabled"
        :id="`availability-${productGetters.getAvailabilityId(product)}`"
        size="sm"
        :class="commonClasses"
        :style="{
          backgroundColor: productGetters.getAvailabilityBackgroundColor(product),
          color: productGetters.getAvailabilityTextColor(product),
        }"
      >
        {{ productGetters.getAvailabilityName(product) }}
      </SfListItem>

      <template v-if="tagsEnabled && productTags.length > 0">
        <SfListItem
          v-for="(tag, index) in productTags"
          :key="index"
          :id="`tag-${tag.id}`"
          size="sm"
          :class="[commonClasses, tagGetters.getTagTextColorIsDark(tag) ? 'text-dark' : 'text-white']"
          :style="{ backgroundColor: tagGetters.getTagBackgroundColor(tag) }"
        >
          {{ tagGetters.getTagName(tag) }}
        </SfListItem>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { SfListItem } from '@storefront-ui/vue';
import { productGetters, tagGetters } from '@plentymarkets/shop-sdk';
import type { BadgesProps } from '~/components/ui/Badges/types';
import { ProductTag } from '@plentymarkets/shop-api';

const commonClasses = 'text-xs font-medium select-none rounded-md !w-fit !cursor-text opacity-75 !px-2';
const props = withDefaults(defineProps<BadgesProps>(), { displayTags: true, displayAvailability: false });
const productTags = ref([] as ProductTag[]);
const product = props.product;
const availabilityEnabled = props.displayAvailability;
const tagsEnabled = props.displayTags;
if (tagsEnabled) productTags.value = tagGetters.getTags(product);
</script>
