<template>
  <div :style="inlineStyle" data-testid="item-data-block">
    <div v-if="showNoDataMessage" class="mx-4 mt-4 mb-4 flex items-start gap-2 text-sm text-neutral-600">
      <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" />
      <span class="italic">{{ getEditorTranslation('no-data-to-show') }}</span>
    </div>
    <template v-if="hasRows">
      <div v-if="displayAsCollapsable">
        <UiAccordionItem
          v-model="isOpen"
          summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
          data-testid="item-data"
        >
          <template #summary>
            <h2 class="font-bold text-lg leading-6 md:text-2xl">
              {{ title }}
            </h2>
          </template>

          <v-table density="comfortable" class="item-info-table">
            <tbody>
              <tr v-for="row in visibleRows" :key="row.key" class="item-info-table__row">
                <td class="item-info-table__cell item-info-table__label">
                  {{ row.label }}
                </td>
                <td class="item-info-table__cell item-info-table__value">
                  {{ row.value }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </UiAccordionItem>
      </div>

      <div v-else>
        <h2 v-if="title" class="font-bold text-lg leading-6 md:text-2xl mb-2">
          {{ title }}
        </h2>

        <v-table density="comfortable" class="item-info-table">
          <tbody>
            <tr v-for="row in visibleRows" :key="row.key" class="item-info-table__row">
              <td class="item-info-table__cell item-info-table__label">
                {{ row.label }}
              </td>
              <td class="item-info-table__cell item-info-table__value">
                {{ row.value }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@plentymarkets/shop-api';
import type { ItemDataContent, ItemDataFieldKey, ItemDataFieldLabels } from './types';
import { SfIconWarning } from '@storefront-ui/vue';

const props = defineProps<{
  content: ItemDataContent;
}>();
const { t } = useI18n();
const { currentProduct } = useProducts();

const { $isPreview } = useNuxtApp();

const { disableActions } = useEditor();

const { fieldValues } = useItemDataTable(currentProduct as Ref<Product | null>, {
  t,
});
const fieldLabels = computed<ItemDataFieldLabels>(() => ({
  itemId: t('field-itemId'),
  condition: t('field-condition'),
  ageRating: t('field-ageRating'),
  externalVariationId: t('field-externalVariationId'),
  model: t('field-model'),
  manufacturer: t('field-manufacturer'),
  manufacturingCountry: t('field-manufacturingCountry'),
  content: t('field-content'),
  grossWeight: t('field-grossWeight'),
  netWeight: t('field-netWeight'),
  dimensions: t('field-dimensions'),
  customTariffNumber: t('field-customTariffNumber'),
  properties: t('field-properties'),
}));

const title = computed(() => props.content.text?.title ?? 'More details');

const hasTitle = computed(() => title.value.trim().length > 0);

const displayAsCollapsable = computed(() => {
  const layout = props.content.layout;
  return hasTitle.value && (layout?.displayAsCollapsable ?? false);
});

const noFieldsSelected = computed(() => {
  const fields = props.content.fields;
  if (!fields) return false;

  const values = Object.values(fields);
  if (!values.length) return false;

  return values.every((v) => !v);
});

const showNoDataMessage = computed(
  () => $isPreview && disableActions.value && !hasTitle.value && noFieldsSelected.value,
);

const visibleRows = computed(() => {
  const order =
    props.content.fieldsOrder && props.content.fieldsOrder.length
      ? props.content.fieldsOrder
      : (Object.keys(fieldLabels.value) as ItemDataFieldKey[]);

  const visibility = props.content.fields || {};

  const rows = order
    .filter((key: ItemDataFieldKey) => visibility[key] ?? true)
    .map((key: ItemDataFieldKey) => ({
      key,
      label: fieldLabels.value[key],
      value: fieldValues.value[key],
    }));

  return rows.filter((row) => {
    const v = row.value;
    if (v == null) return false;
    return String(v).trim().length > 0;
  });
});

const hasRows = computed(() => visibleRows.value.length > 0);

const inlineStyle = computed(() => {
  const layout = props.content.layout;
  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : undefined,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : undefined,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : undefined,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : undefined,
  };
});

const isOpen = ref(!(props.content.layout?.initiallyCollapsed ?? false));

watch(
  () => props.content.layout?.initiallyCollapsed,
  (val) => {
    if (val === undefined) return;
    isOpen.value = !(val ?? false);
  },
);
</script>

<i18n lang="json">
{
  "en": {
    "field-itemId": "Item ID",
    "field-condition": "Condition",
    "field-externalVariationId": "External variation ID",
    "field-model": "Model",
    "field-manufacturer": "Manufacturer",
    "field-manufacturingCountry": "Manufacturing country",
    "field-content": "Content",
    "field-grossWeight": "Gross weight",
    "field-netWeight": "Net weight",
    "field-dimensions": "Dimensions",
    "field-customTariffNumber": "Custom tariff number",
    "field-properties": "Properties",
    "field-ageRating": "Age rating",
    "single-item-age-restriction": " {age} and older",
    "single-item-age-restriction-none": "No age restriction",
    "single-item-age-restriction-not-flagged": "Not rated",
    "single-item-age-restriction-not-required": "Not required",
    "single-item-age-restriction-unknown": "Unknown",
    "no-data-to-show": "You haven’t selected any field to display. Please choose a field or remove this block."
  },
  "de": {
    "field-itemId": "Art.-ID",
    "field-condition": "Zustand",
    "field-externalVariationId": "Varianten-ID",
    "field-model": "Modell",
    "field-manufacturer": "Hersteller",
    "field-manufacturingCountry": "Herstellungsland",
    "field-content": "Inhalt",
    "field-grossWeight": "Gewicht",
    "field-netWeight": "Netto-Gewicht",
    "field-dimensions": "Maße",
    "field-customTariffNumber": "Zolltarifnummer",
    "field-properties": "Eigenschaften",
    "field-ageRating": "Altersfreigabe",
    "single-item-age-restriction": "Ab {age} freigegeben",
    "single-item-age-restriction-none": "Ohne Altersbeschränkung",
    "single-item-age-restriction-not-flagged": "Nicht gekennzeichnet",
    "single-item-age-restriction-not-required": "Nicht erforderlich",
    "single-item-age-restriction-unknown": "Noch nicht bekannt",
    "no-data-to-show": "You haven’t selected any field to display. Please choose a field or remove this block."
  }
}
</i18n>
