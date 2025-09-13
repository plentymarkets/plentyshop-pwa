<template>
  <div class="sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
    <div data-testid="image-text-form">
      <!-- <div v-for="column in multiGridStructure.content" :key="column.meta.uuid">
        <component
          :is="getComponent(column.name)"
          v-if="column.name !== 'EmptyGridBlock'"
          :uuid="column.meta?.uuid || ''"
        />
      </div> -->

      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('margin-label') }}</UiFormLabel>
        <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowUpward /></span>
            <input
              v-model.number="layout.marginTop"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="margin-top"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowDownward /></span>
            <input
              v-model.number="layout.marginBottom"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="margin-bottom"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowBack /></span>
            <input
              v-model.number="layout.marginLeft"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="margin-left"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
            <span><SfIconArrowForward /></span>
            <input
              v-model.number="layout.marginRight"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="margin-right"
            />
          </div>
        </div>
        <!-- <div class="px-4 py-3">
          <span class="typography-text-xs text-neutral-700">
            {{ getEditorTranslation('spacing-around') }}
          </span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';
import { SfIconArrowUpward, SfIconArrowDownward, SfIconArrowBack, SfIconArrowForward } from '@storefront-ui/vue';
const { blockUuid } = useSiteConfiguration();
const { data } = useCategoryTemplate();
const { findOrDeleteBlockByUuid } = useBlockManager();

const multiGridStructure = computed(() => {
  const block = (findOrDeleteBlockByUuid(data.value, blockUuid.value) as ColumnBlock) || { content: [] };

  return block;
});

const layout = computed(
  () =>
    multiGridStructure.value.layout ?? {
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    },
);

// const modules = import.meta.glob('@/components/**/blocks/**/*Form.vue') as Record<
//   string,
//   () => Promise<{ default: unknown }>
// >;

// const getComponent = (blockName: string) => {
//   if (!blockName) return null;
//   console.log('blockName', blockName);
//   const regex = new RegExp(`${blockName}Form\\.vue$`, 'i');
//   const matched = Object.keys(modules).find((path) => regex.test(path));
//   return matched ? defineAsyncComponent(modules[matched]) : null;
// };
</script>

<i18n lang="json">
{
  "en": {
    "margin-label": "Margin"
  },
  "de": {
    "margin-label": "Margin"
  }
}
</i18n>
