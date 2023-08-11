<template>
  <div class="px-4" data-testid="product-properties">
    <SfSelect @update:modelValue="changeVariationId" v-model="selectedVariation" size="sm" placeholder="-- Select --">
      <option v-for="{ value, label } in options" :key="value" :value="value">
        {{ label }}
      </option>
    </SfSelect>
  </div>
</template>

<script setup lang="ts">
import Vue from 'vue';
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfSelect } from '@storefront-ui/vue';
import { ProductPropertiesProps } from '~/components/ProductProperties/types';

const props = defineProps<ProductPropertiesProps>();
const product = props.product;
// this should be refactored..if you have multiple variation types
const options = computed(() => productGetters.getAttributes([product], ['color', 'size'])[0][0].map(x => ({ value: x.variationId, label: x.value })));

const router = useRouter();
const route = useRoute();
const slug = route.params.slug as string;
const productId = slug.split('-').pop() ?? '0';
const selectedVariation = ref(productId);

const changeVariationId = (newId: String) => {
  const delimiter = '-' as string;
  const newLink = slug.substring(0, slug.lastIndexOf(delimiter)) + delimiter + `${newId}` as String;
  router.push({ name: route.name, params: { slug: newLink } });
};

</script>
