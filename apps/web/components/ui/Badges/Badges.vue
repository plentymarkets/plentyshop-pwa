<template>
  <div data-testid="badges">
    <ul>
      <template v-if="tagsEnabled && productTags.length > 0">
        <SfListItem
          v-for="(tag, index) in productTags"
          :key="index"
          size="sm"
          class="text-xs font-medium select-none rounded-md !w-fit !cursor-text !px-2 opacity-75 mr-2 mb-2"
          :class="[
            tagGetters.getAgenciesTagCLass(tag),
            tagGetters.getTagTextColorIsDark(tag) ? 'text-dark' : 'text-white',
          ]"
          :style="{ backgroundColor: tagGetters.getTagBackgroundColor(tag) }"
        >
          {{ tagGetters.getTagName(tag) }}
        </SfListItem>
      </template>

      <SfListItem
        v-if="availabilityEnabled && productGetters.getAvailabilityName(product)"
        size="sm"
        class="text-xs font-medium select-none rounded-md !w-fit !cursor-text !px-2 grid mt-2"
        :class="[productGetters.getAgenciesAvailabilityCLass(product)]"
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
import type { ProductTag } from '@plentymarkets/shop-api';

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
