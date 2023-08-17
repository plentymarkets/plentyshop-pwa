<template>
  <div v-if="attributeGroups && attributeGroups.length" class="px-4" data-testid="product-properties">
    <SfSelect class="mb-2" v-for="(attributeGroup, index) in attributeGroups" :key="index"
      @update:modelValue="changeVariationId" v-model="selectedVariation" size="sm" placeholder="-- Select --">
      <option v-for="{ value, label } in attributeGroup.map(x => ({ value: x.variationId.toString(), label: x.value }))" :key="value"
        :value="value">
        {{ label }}
      </option>
    </SfSelect>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfSelect } from '@storefront-ui/vue';
import { ProductPropertiesProps } from '~/components/ProductProperties/types';
import { RouteRecordName, RouteParamValueRaw } from 'vue-router';
const props = defineProps<ProductPropertiesProps>();
const product = props.product;

interface ProductAttributeInterface {
  type: string;
  id: string;
  value: string;
  label: string;
  variationId: number;
};


const attributeGroups = computed((): ProductAttributeInterface[][] => {
  const groupsForProducts = productGetters.getAttributes([product], ['color', 'size']) as ProductAttributeInterface[][][];
  if (groupsForProducts) {
    return groupsForProducts[0]
  } else {
    return []
  }
}
);

const router = useRouter();
const route = useRoute();
const slug = route.params.slug as string;
const productId = slug.split('-').pop() ?? '0';
const selectedVariation = ref(productId);

const changeVariationId = (newId: String) => {
  const delimiter = '-' as string;
  const newLink = slug.substring(0, slug.lastIndexOf(delimiter)) + delimiter + `${newId}` as RouteParamValueRaw | (string | number)[];
  router.push({ name: route.name as RouteRecordName | undefined, params: { slug: newLink } });
};

</script>
