<template>
  <div>
    <UiAccordionItem v-if="displayAsCollapsable" v-model="initiallyCollapsed"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none">
      <template #summary>
        <h2 class="font-bold text-lg leading-6 md:text-2xl">
          {{ title }}
        </h2>
      </template>
      <div class="no-preflight" v-html="text" />
    </UiAccordionItem>
    <div v-else>
      <h2 class="font-bold text-lg leading-6 md:text-2xl">
        {{ title }}
      </h2>
      <div class="no-preflight" v-html="text" />
    </div>
    <UiDivider v-if="initiallyCollapsed && text?.length" class="mb-2 mt-2" />
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { ItemTextProps } from './types';
import type { ItemTextContent } from '~/components/blocks/ItemText/types';
const { t } = useI18n();
const route = useRoute();
const props = defineProps<ItemTextProps>();
const title = props.content?.title
const initiallyCollapsed = props.content?.initiallyCollapsed
const displayAsCollapsable = props.content?.displayAsCollapsable
const { productId } = createProductParams(route.params);
const { data: product } = useProduct(productId);
const text = computed(() => { return productGetters.getDescription(product.value) ?? 'see tab "item text"' });
</script>
