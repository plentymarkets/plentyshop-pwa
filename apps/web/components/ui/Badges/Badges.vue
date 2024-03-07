<template>
  <div data-testid="badges">
    <ul class="flex flex-row flex-wrap gap-2">
      <template v-if="tagsEnabled && productTags.length > 0">
        <SfListItem
          v-for="(tag, index) in productTags"
          :key="index"
          size="sm"
          :class="[
            commonClasses,
            tagGetters.getAgenciesTagCLass(tag),
            'opacity-75',
            tagGetters.getTagTextColorIsDark(tag) ? 'text-dark' : 'text-white',
          ]"
          :style="{ backgroundColor: tagGetters.getTagBackgroundColor(tag) }"
        >
          {{ tagGetters.getTagName(tag) }}
        </SfListItem>
      </template>

      <SfListItem
        v-if="availabilityEnabled"
        size="sm"
        :class="[commonClasses, productGetters.getAgenciesAvailabilityCLass(product), '!gap-1']"
        :style="availabilityStyles"
      >
        {{ productGetters.getAvailabilityName(product) }}
      </SfListItem>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { SfListItem } from '@storefront-ui/vue';
import { productGetters, tagGetters } from '@plentymarkets/shop-sdk';
import type { BadgesProps } from '~/components/ui/Badges/types';
import { ProductTag } from '@plentymarkets/shop-api';

const commonClasses = 'text-xs font-medium select-none rounded-md !w-fit !cursor-text !px-2';
const props = withDefaults(defineProps<BadgesProps>(), { useTags: true, useAvailability: false });
const productTags = ref([] as ProductTag[]);
const availabilityStyles = ref({});
const product = props.product;

const availabilityEnabled = props.useAvailability;
if (availabilityEnabled) {
  availabilityStyles.value = {
    backgroundColor: productGetters.getAvailabilityBackgroundColor(product),
    color: productGetters.getAvailabilityTextColor(product),
  };
}

const tagsEnabled = props.useTags;
if (tagsEnabled) {
  productTags.value = tagGetters.getTags(product);
}
</script>
