<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
const { $registerMessages } = useNuxtApp();
$registerMessages({
  en: {
    'filter.prices.price_asc': 'Price ⬆',
    'filter.prices.price_desc': 'Price ⬇',
    'filter.position_asc': 'Availability ⬆',
    'filter.position_desc': 'Availability ⬇',
    'analyzed.number.sorting_asc': 'Variation number ⬆',
    'analyzed.number.sorting_desc': 'Variation number ⬇',
    'filter.availabilityAverageDays_asc': 'Variation ID ⬆',
    'filter.availabilityAverageDays_desc': 'Variation ID ⬇',
    'filter.isMain_desc': 'Main Variation First',
    variationId_asc: 'Variation ID ⬆',
    variationId_desc: 'Variation ID ⬇',
  },
  de: {
    'filter.prices.price_asc': 'Price ⬆',
    'filter.prices.price_desc': 'Price ⬇',
    'filter.position_asc': 'Availability ⬆',
    'filter.position_desc': 'Availability ⬇',
    'analyzed.number.sorting_asc': 'Variation number ⬆',
    'analyzed.number.sorting_desc': 'Variation number ⬇',
    'filter.availabilityAverageDays_asc': 'Variation ID ⬆',
    'filter.availabilityAverageDays_desc': 'Variation ID ⬇',
    'filter.isMain_desc': 'Main Variation First',
    variationId_asc: 'Variation ID ⬆',
    variationId_desc: 'Variation ID ⬇',
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Item"
  },
  "de": {
    "label": "Item"
  }
}
</i18n>
