<template>
  <div class="px-4" data-testid="product-properties">
    <div v-if="product && product.variations" class="flex flex-col gap-y-6 font-body">
      <label>
        <span class="pb-1 text-sm font-medium text-neutral-900"> Variations </span>
        <SfSelect @update:modelValue="changeRouteId" size="sm" placeholder="-- Select --">
          <option v-for="{ variationId } in product.variations" :key="variationId" :value="variationId">
            {{ variationId }}
          </option>
        </SfSelect>
      </label>
    </div>
    <!-- <fieldset v-if="sizes?.length" class="pb-4">
      <legend class="block mb-2 text-base font-medium leading-6 text-neutral-900">{{ $t('size') }}</legend>
      <span v-for="{ label, value } in sizes" class="mr-2 mb-2 uppercase" :key="value">
        <SfChip
          class="min-w-[48px]"
          size="sm"
          :input-props="{
            onClick: (e) => value == selectedSize && e.preventDefault(),
          }"
          :model-value="value === selectedSize"
          @update:model-value="value !== selectedSize && setAttribute('size', value)"
        >
          {{ label }}
        </SfChip>
      </span>
    </fieldset>
    <fieldset v-if="sizes?.length" class="pb-2">
      <legend class="block mb-2 text-base font-medium leading-6 text-neutral-900">{{ $t('color') }}</legend>
      <span v-for="{ label, value } in colors" class="mr-2 mb-2 uppercase" :key="value">
        <SfChip
          class="min-w-[48px]"
          size="sm"
          :input-props="{
            onClick: (e) => value == selectedSize && e.preventDefault(),
          }"
          :model-value="value === selectedColor"
          @update:model-value="setAttribute('color', value)"
        >
          <template #prefix><SfThumbnail size="sm" :style="{ background: value }" /></template>
          {{ label }}
        </SfChip>
      </span>
    </fieldset> -->
  </div>
</template>

<script setup lang="ts">
// import { SfChip, SfThumbnail } from '@storefront-ui/vue';
import { ProductPropertiesProps } from '~/components/ProductProperties/types';
import { SfSelect } from '@storefront-ui/vue';

const router = useRouter();
const route = useRoute();

const slug = route.params.slug as string;

const changeRouteId = (newId: String) => {
  const delimiter = '-' as string;
  const newFileName = slug.substring(0, slug.lastIndexOf(delimiter)) + delimiter + newId;
  router.push({'name': route.name, params: {slug: newFileName}});
};

const props = defineProps<ProductPropertiesProps>();
const product = props.product;
// const { getAttributeList, getAttribute, setAttribute } = useProductAttribute(props.product, ['color', 'size']);

// const sizes = getAttributeList('size');
// const colors = getAttributeList('color');
// const selectedSize = computed(() => getAttribute('size'));
// const selectedColor = computed(() => getAttribute('color'));
</script>
