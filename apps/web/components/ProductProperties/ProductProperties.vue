<template>
  <div class="px-4" data-testid="product-properties">
    <!-- <div>
      {{ optionsold }}
    </div> -->
    <div>
      options new-Different on client (correctway)
    </div>
    <div>
      {{ optionsClientSsrCorrectWay }}
    </div>
      <!-- <SfSelect
      v-for="(option, key) in options"
      :key="key"
      size="sm"
      v-e2e="'size-select'"
      class="sf-select--underlined product__select-size"
      :label="option.label"
    >
      <option v-for="(optionValue, valueKey) in option.value" :key="valueKey" :value="valueKey">
        {{ optionValue }}
      </option>
    </SfSelect> -->
  </div>
</template>

<script setup lang="ts">
import Vue from 'vue';
import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { SfSelect } from '@storefront-ui/vue';
import { ProductPropertiesProps } from '~/components/ProductProperties/types';

const props = defineProps<ProductPropertiesProps>();
const product = props.product;

const optionsold = computed(() => {
  if(product) {
    return productGetters.getAttributes([product], ['color', 'size']);
  }
  return null
});

const optionsClientSsrCorrectWay = computed(() => {
  if(product) {
    let options = null
    if (process.client) {
      options =  productGetters.getAttributes([product.value], ['color', 'size']);
    } else {
      options =  productGetters.getAttributes([product], ['color', 'size']);
    }
    return options
  }
  return null
});

const router = useRouter();
const route = useRoute();
const slug = route.params.slug as string;
const changeVariationId = (newId: String) => {
  const delimiter = '-' as string;
  const newLink = slug.substring(0, slug.lastIndexOf(delimiter)) + delimiter + `${newId}` as String;
  router.push({ name: route.name, params: { slug: newLink } });
};

</script>
