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
import { RouteRecordName, RouteParamValueRaw } from 'vue-router';
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
const route = useRoute();
const slug = route.params.slug as string;
const productId = slug.split('-').pop() ?? '0';
const selectedVariation = ref(productId);

const changeVariationId = (updatedId: String) => {
  const delimiter = '-';
  const link = (slug.slice(0, Math.max(0, slug.lastIndexOf(delimiter))) + delimiter + `${updatedId}`) as
    | RouteParamValueRaw
    | (string | number)[];
  router.push({ name: route.name as RouteRecordName | undefined, params: { slug: link } });
};
</script>
