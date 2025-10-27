<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>

    <template #setting-description>
      <div class="flex flex-col px-4 text-sm">
        <p class="pb-2">
          <span class="align-middle font-bold">{{ getEditorTranslation('description') }}</span>
        </p>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
const { $registerMessages } = useNuxtApp();
$registerMessages({
  en: {
    'default.recommended_sorting': 'Recommended',
    'item.id_asc': 'Item ID ⬆',
    'item.id_desc': 'Item ID ⬇',
    'texts.name1_asc': 'Name A-Z',
    'texts.name1_desc': 'Name Z-A',
    'sorting.price.avg_asc': 'Price ⬆',
    'sorting.price.avg_desc': 'Price ⬇',
    'variation.id_asc': 'Variation ID ⬆',
    'variation.id_desc': 'Variation ID ⬇',
    'variation.createdAt_desc': 'Newest items',
    'variation.createdAt_asc': 'Oldest items',
    'variation.availability.averageDays_asc': 'Availability ⬆',
    'variation.availability.averageDays_desc': 'Availability ⬇',
    'variation.number_asc': 'Variation number ⬆',
    'variation.number_desc': 'Variation number ⬇',
    'variation.updatedAt_asc': 'Last update',
    'variation.updatedAt_desc': 'First update',
    'variation.position_asc': 'Top seller ⬆',
    'variation.position_desc': 'Top seller ⬇',
    'item.manufacturer.externalName_asc': 'Manufacturer A-Z',
    'item.manufacturer.externalName_desc': 'Manufacturer Z-A',
    'item.feedbackDecimal_asc': 'Item reviews ⬆',
    'item.feedbackDecimal_desc': 'Item reviews ⬇',
    'item.score': 'Relevance (Search result only)',
    'stock.net_asc': 'Stock ⬆',
    'stock.net_desc': 'Stock ⬇',
    'item.manufacturer.position_asc': 'Manufacturer position ⬆',
    'item.manufacturer.position_desc': 'Manufacturer position ⬇',
    'item.random': 'Random',
    notSelected: 'Not selected',
  },
  de: {
    'default.recommended_sorting': 'Recommended',
    'item.id_asc': 'Item ID ⬆',
    'item.id_desc': 'Item ID ⬇',
    'texts.name1_asc': 'Name A-Z',
    'texts.name1_desc': 'Name Z-A',
    'sorting.price.avg_asc': 'Price ⬆',
    'sorting.price.avg_desc': 'Price ⬇',
    'variation.id_asc': 'Variation ID ⬆',
    'variation.id_desc': 'Variation ID ⬇',
    'variation.createdAt_desc': 'Newest items',
    'variation.createdAt_asc': 'Oldest items',
    'variation.availability.averageDays_asc': 'Availability ⬆',
    'variation.availability.averageDays_desc': 'Availability ⬇',
    'variation.number_asc': 'Variation number ⬆',
    'variation.number_desc': 'Variation number ⬇',
    'variation.updatedAt_asc': 'Last update',
    'variation.updatedAt_desc': 'First update',
    'variation.position_asc': 'Top seller ⬆',
    'variation.position_desc': 'Top seller ⬇',
    'item.manufacturer.externalName_asc': 'Manufacturer A-Z',
    'item.manufacturer.externalName_desc': 'Manufacturer Z-A',
    'item.feedbackDecimal_asc': 'Item reviews ⬆',
    'item.feedbackDecimal_desc': 'Item reviews ⬇',
    'item.score': 'Relevance (Search result only)',
    'stock.net_asc': 'Stock ⬆',
    'stock.net_desc': 'Stock ⬇',
    'item.manufacturer.position_asc': 'Manufacturer position ⬆',
    'item.manufacturer.position_desc': 'Manufacturer position ⬇',
    'item.random': 'Random',
    notSelected: 'Not selected',
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Sorting",
    "description": "Control settings that affect the sorting on category pages."
  },
  "de": {
    "label": "Sorting",
    "description": "Control settings that affect the sorting on category pages."
  }
}
</i18n>
