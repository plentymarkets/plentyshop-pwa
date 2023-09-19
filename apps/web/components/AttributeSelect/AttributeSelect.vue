<template>
  <div v-if="attributeGroups && attributeGroups.length > 0" class="px-4" data-testid="product-properties">
    <SfSelect
      v-for="(attributeGroup, index) in attributeGroups"
      :key="index"
      class="mb-2"
      @update:model-value="changeVariationId"
      v-model="selectedVariation"
      size="sm"
      placeholder="-- Select --"
    >
      <option v-for="{ value, label } in mapValueAndLabel(attributeGroup)" :key="value" :value="value">
        {{ label }}
      </option>
    </SfSelect>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-sdk';
import { ProductAttributeValue } from '@plentymarkets/shop-sdk/lib/getters/agnostic.types';
import { SfSelect } from '@storefront-ui/vue';
import { AttributeSelectProps } from '~/components/AttributeSelect/types';

const props = defineProps<AttributeSelectProps>();
const product = props.product;

const attributeGroups = computed((): ProductAttributeValue[][] => {
  const groupsForProducts = productGetters.getAttributes([product]) as ProductAttributeValue[][][];
  return groupsForProducts[0] ?? [];
});

const mapValueAndLabel = (attributeGroup: ProductAttributeValue[]) => {
  return attributeGroup.map((x) => ({ value: x.variationId.toString(), label: x.value }));
};

const router = useRouter();

const selectedVariation = ref(product.variation.id.toString());

const changeVariationId = (updatedId: string) => {
  const productSlug = productGetters.getSlug(product) + `_${productGetters.getItemId(product)}_${updatedId}`;

  router.push(productSlug);
};
</script>
