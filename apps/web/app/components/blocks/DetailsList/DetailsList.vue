<template>
  <div data-testid="details-list" class="flex flex-col divide-y divide-neutral-200">
    <UiAccordionItem
      v-for="(item, index) in visibleItems"
      :key="item.meta.uuid"
      v-model="openState[item.meta.uuid]"
      icon-position="start"
      summary-class="w-full py-3 flex items-center gap-2 select-none"
      :data-testid="`details-list-item-${index}`"
    >
      <template #summary>
        <span class="font-medium">{{ itemLabel(item, index) }}</span>
      </template>
      <slot name="content" :content-block="item" :index="index" />
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';
import type { DetailsListProps } from './types';
import { getDetailsListItemLabel, getDetailsListItemDefaultOpen } from './helpers';

const props = defineProps<DetailsListProps>();

const { t } = useI18n();

const visibleItems = computed(() => (props.content ?? []).filter((block) => block.configuration?.visible !== false));

const openState = reactive<Record<string, boolean>>({});

watch(
  visibleItems,
  (items) => {
    items.forEach((item) => {
      if (!(item.meta.uuid in openState)) {
        openState[item.meta.uuid] = getDetailsListItemDefaultOpen(item);
      }
    });
  },
  { immediate: true },
);

const itemLabel = (block: Block, index: number) => getDetailsListItemLabel(block, index, t('detailsList.itemLabel'));
</script>

<i18n lang="json">
{
  "en": {
    "detailsList": {
      "itemLabel": "Item"
    }
  },
  "de": {
    "detailsList": {
      "itemLabel": "Element"
    }
  }
}
</i18n>
