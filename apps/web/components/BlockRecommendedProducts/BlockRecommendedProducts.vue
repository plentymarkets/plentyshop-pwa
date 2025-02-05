<template>
  <div class="px-2">
    <label>
      <UiFormLabel class="mb-1">Category Id</UiFormLabel>
      <SfInput v-model="recomandedBlockValue.categoryId" name="category Id" type="text" placeholder="Enter Category Id" />
    </label>
  </div>
</template>

<script setup lang="ts">
import { clamp } from '@storefront-ui/shared';
import {
  SfInput,
  useDisclosure,
} from '@storefront-ui/vue';

const { open } = useDisclosure();
const { data, updateProductRecommendedProductsOptions } = useHomepage();

const recomandedBlock = computed(
  () => (data.value.blocks.find((block: Block) => block.name === 'ProductRecommendedProducts')?.options || {}) as ProductRecommendedProductsOptions,
);

const recomandedBlockValue = computed({
  get: () => {
    return recomandedBlock.value;
  },
  set: (value) => updateProductRecommendedProductsOptions(value)
  }
);

</script>
