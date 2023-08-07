<template>
  <div class="px-4" data-testid="product-properties">
    <div v-if="product && product.variations" class="flex flex-col gap-y-6 font-body">
      <label>
        <!-- <span class="pb-1 text-sm font-medium text-neutral-900"> Variations </span> -->
        <SfSelect @update:modelValue="changeVariationId" size="sm" placeholder="--Please Select --">
          <option v-for="{ variationId } in product.variations" :key="variationId" :value="variationId">
            {{ variationId }}
          </option>
        </SfSelect>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductPropertiesProps } from '~/components/ProductProperties/types';
import { SfSelect } from '@storefront-ui/vue';

const props = defineProps<ProductPropertiesProps>();
const product = props.product;
const router = useRouter();
const route = useRoute();
const slug = route.params.slug as string;
const changeVariationId = (newId: String) => {
  const delimiter = '-' as string;
  // eslint-disable-next-line unicorn/no-keyword-prefix
  const newLink = slug.substring(0, slug.lastIndexOf(delimiter)) + delimiter + `${newId}` as String;
  router.push({ name: route.name, params: { slug: newLink } });
};
// const { getAttributeList, getAttribute, setAttribute } = useProductAttribute(props.product, ['color', 'size']);

// const sizes = getAttributeList('size');
// const colors = getAttributeList('color');
// const selectedSize = computed(() => getAttribute('size'));
// const selectedColor = computed(() => getAttribute('color'));
</script>
