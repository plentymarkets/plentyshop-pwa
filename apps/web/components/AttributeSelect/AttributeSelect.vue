<template>
  <div v-if="attributeGroups && attributeGroups.length > 0" class="px-4" data-testid="product-properties">
    <SfSelect
      v-for="(attributeGroup, index) in attributeGroups"
      :key="index"
      class="mb-2"
      @update:model-value="changeVariationId"
      v-model="selected"
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

const i18n = useI18n();
const { selectedVariation } = useProducts();

const attributeGroups = computed((): ProductAttributeValue[][] => {
  const groupsForProducts = productGetters.getAttributes([product]) as ProductAttributeValue[][][];

  if (groupsForProducts?.[0]?.[0]) {
    groupsForProducts[0][0].unshift({
      type: 'dropdown',
      value: i18n.t('pleaseSelect'),
      label: i18n.t('pleaseSelect'),
      id: '',
      variationId: 0,
    });
  }

  return groupsForProducts[0] ?? [];
});

const mapValueAndLabel = (attributeGroup: ProductAttributeValue[]) => {
  return attributeGroup.map((x) => ({ value: x.variationId.toString(), label: x.value }));
};

const router = useRouter();

const selected = ref(selectedVariation?.value?.variation?.id.toString() || '0');

const changeVariationId = (updatedId: string) => {
  const variation = Number(updatedId) ? `_${updatedId}` : '';

  const productSlug = productGetters.getSlug(product) + `_${productGetters.getItemId(product)}${variation}`;

  router.push(productSlug);
};
</script>
