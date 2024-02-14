<template>
  <div data-testid="product-attributes">
    <div v-for="(attribute, index) in transformedProduct.attributes" :key="index" class="mb-2">
      <label :for="'attribute-' + attribute.attributeId" class="capitalize text-xs text-neutral-500">
        {{ attribute.name }}
      </label>
      <SfSelect
        :id="'attribute-' + attribute.attributeId"
        @update:model-value="changeVariationId($event, index)"
        v-model="selectedVariationsAsString[index]"
        size="sm"
        :placeholder="$t('pleaseSelect')"
      >
        <option :value="null">{{ $t('pleaseSelect') }}</option>
        <option
          v-for="value in attribute.values"
          :key="value.attributeValueId"
          :value="value.attributeValueId"
          :disabled="value.disabled"
        >
          {{ value.name }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import { AttributeSelectProps, TransformedProduct } from '~/components/AttributeSelect/types';
import { Product } from '@plentymarkets/shop-api';

const props = defineProps<AttributeSelectProps>();
const product = props.product ?? { variationAttributeMap: { attributes: [], variations: [] } };

const router = useRouter();
const route = useRoute();

const transformProductData = (product: Product): TransformedProduct => {
  const attributes = product?.variationAttributeMap?.attributes.map(({ attributeId, name, values }) => ({
    attributeId,
    name,
    values: values.map(({ attributeValueId, name }) => ({
      attributeValueId,
      name,
      disabled: false,
    })),
  }));

  const combinations = product?.variationAttributeMap?.variations.map(({ variationId, isSalable, attributes }) => ({
    variationId,
    isSalable,
    attributes: attributes ?? [],
    attributeCombination: attributes ?? [],
  }));

  return {
    attributes: attributes ?? [],
    combinations: combinations ?? [],
  };
};

const extractVariationIdFromPath = () => {
  if (!route?.fullPath) {
    return null;
  }

  const match = route.fullPath.match(/_(\d+)$/);
  return match ? Number(match[1]) : null;
};

const transformedProduct = reactive<TransformedProduct>(transformProductData(product));

const currentVariationId = computed(() => {
  return extractVariationIdFromPath();
});

const setInitialSelectedVariations = (): (number | null)[] => {
  if (currentVariationId.value) {
    const currentCombination = transformedProduct.combinations.find(
      (combo) => combo.variationId === currentVariationId.value,
    );
    if (currentCombination) {
      return transformedProduct.attributes.map((attribute) => {
        const attInCombination = currentCombination.attributeCombination.find(
          (att) => att.attributeId === attribute.attributeId,
        );
        return attInCombination ? attInCombination.attributeValueId : null;
      });
    }
  }
  return Array.from({ length: transformedProduct.attributes.length }).fill(null) as (number | null)[];
};

let selectedVariations = ref(setInitialSelectedVariations());

const selectedVariationsAsString = computed<string[]>({
  get: () => selectedVariations.value.map((value) => (value === null ? '' : value.toString())),
  set: (values) => {
    selectedVariations.value = values.map((value) => (value === '' ? null : Number(value)));
  },
});

const resetDisabledStatus = () => {
  for (const attribute of transformedProduct.attributes) {
    for (const value of attribute.values) {
      value.disabled = false;
    }
  }
};

const isOptionAvailableForCurrentSelection = (
  attributeId: number,
  valueId: number,
  temporarySelectedVariations: (number | null)[],
): boolean => {
  return transformedProduct.combinations.some((combination) => {
    if (!combination.isSalable) return false;

    const matchesSelected = combination.attributeCombination.every((attribute, index) => {
      return (
        temporarySelectedVariations[index] === null || temporarySelectedVariations[index] === attribute.attributeValueId
      );
    });

    if (!matchesSelected) return false;

    const attributeInCombination = combination.attributeCombination.find(
      (attribute) => attribute.attributeId === attributeId,
    );
    return attributeInCombination && attributeInCombination.attributeValueId === valueId;
  });
};

const updateAvailableOptions = () => {
  for (const [index, attribute] of transformedProduct.attributes.entries()) {
    for (const value of attribute.values) {
      const temporarySelectedVariations = [...selectedVariations.value];
      temporarySelectedVariations[index] = value.attributeValueId;
      value.disabled = !isOptionAvailableForCurrentSelection(
        attribute.attributeId,
        value.attributeValueId,
        temporarySelectedVariations,
      );
    }
  }
};

const getSelectedVariationId = () => {
  const matchingCombination = transformedProduct.combinations.find((combination) => {
    if (!combination.isSalable) return false;

    return combination.attributeCombination.every((attribute, index) => {
      return selectedVariations.value[index] === attribute.attributeValueId;
    });
  });

  return matchingCombination ? matchingCombination.variationId : null;
};

function updateURLPathForVariation(currentPath: string, itemId: string | number, variationId: string | number) {
  const pathSegments = currentPath.split('/');
  let lastSegment = pathSegments[pathSegments.length - 1];
  const lastSegmentParts = lastSegment.split('_');

  itemId = String(itemId);
  variationId = String(variationId);

  const itemIdPosition = lastSegmentParts.length - 1;

  if (lastSegmentParts[itemIdPosition] === itemId) {
    lastSegmentParts.push(variationId);
  } else {
    lastSegmentParts[lastSegmentParts.length - 1] = variationId;
  }

  lastSegment = lastSegmentParts.join('_');
  pathSegments[pathSegments.length - 1] = lastSegment;

  return pathSegments.join('/');
}

const changeVariationId = (selectedValue: string | number | null, index: number): void => {
  if (selectedValue === null) {
    selectedVariations.value = Array.from({ length: transformedProduct.attributes.length }).fill(null) as (
      | number
      | null
    )[];
    resetDisabledStatus();
    removeVariationIdFromUrl(); // Remove variation ID from the URL
  } else {
    selectedVariations.value[index] = Number(selectedValue);
  }

  updateAvailableOptions();

  const variationId = getSelectedVariationId();

  if (variationId) {
    const currentFullPath = route.fullPath;
    const updatedPath = updateURLPathForVariation(currentFullPath, String(route.params.itemId), variationId);
    router.replace({ path: updatedPath });
  }
};

function removeVariationIdFromUrl() {
  const currentFullPath = route.fullPath;
  const segments = currentFullPath.split('_');
  if (segments.length > 2) {
    segments.pop();
    const pathWithoutVariation = segments.join('_');
    router.replace({ path: pathWithoutVariation });
  }
}

watchEffect(() => {
  updateAvailableOptions();
});
</script>
