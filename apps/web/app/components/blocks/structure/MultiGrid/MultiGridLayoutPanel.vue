<template>
  <EditorFormPanel v-model="open" :title="getEditorTranslation('layout')" content-class="px-3.5 py-3 flex flex-col">
    <div v-if="layout">
      <div class="flex items-start gap-3 py-2">
        <div
          class="flex-none w-11 h-9 flex items-center justify-center rounded-md border border-editor-border bg-white overflow-hidden"
        >
          <MarginDiagram :margin-top="layout.marginTop" :margin-bottom="layout.marginBottom" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-medium text-editor-text-default">
            {{ getEditorTranslation('vertical-margin') }}
          </div>
          <div class="mt-1.5 flex gap-1.5">
            <label
              class="flex-1 flex items-center gap-1 pl-2 pr-1.5 py-1 rounded-md border border-editor-canvas-border bg-white focus-within:border-editor-accent focus-within:ring-1 focus-within:ring-editor-accent transition-colors"
            >
              <SfIconArrowUpward size="xs" class="text-editor-text-faint flex-none" />
              <input
                v-model.number="marginTop"
                type="number"
                class="w-full min-w-0 text-xs outline-none bg-transparent text-editor-text-default [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                data-testid="margin-top"
              />
              <span class="text-2xs text-editor-text-faint flex-none">px</span>
            </label>
            <label
              class="flex-1 flex items-center gap-1 pl-2 pr-1.5 py-1 rounded-md border border-editor-canvas-border bg-white focus-within:border-editor-accent focus-within:ring-1 focus-within:ring-editor-accent transition-colors"
            >
              <SfIconArrowDownward size="xs" class="text-editor-text-faint flex-none" />
              <input
                v-model.number="marginBottom"
                type="number"
                class="w-full min-w-0 text-xs outline-none bg-transparent text-editor-text-default [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                data-testid="margin-bottom"
              />
              <span class="text-2xs text-editor-text-faint flex-none">px</span>
            </label>
          </div>
        </div>
      </div>

      <div class="h-px bg-editor-border/60 mx-1" />

      <div class="flex items-center gap-3 py-2">
        <div
          class="flex-none w-11 h-9 flex items-center justify-center rounded-md border border-editor-border bg-white overflow-hidden"
        >
          <ReverseDiagram :on="reverseOnMobile" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-medium text-editor-text-default">
            {{ getEditorTranslation('reverse-on-mobile') }}
          </div>
          <div class="text-2xs text-editor-text-faint leading-snug mt-0.5">
            {{ getEditorTranslation('reverse-on-mobile-helper') }}
          </div>
        </div>
        <SfSwitch
          v-model="reverseOnMobile"
          data-testid="reverse-on-mobile"
          class="checked:bg-editor-button checked:border-gray-500 hover:border-gray-700 hover:before:bg-gray-700"
        />
      </div>

      <div class="h-px bg-editor-border/60 mx-1" />

      <div class="flex items-center gap-3 py-2">
        <div
          class="flex-none w-11 h-9 flex items-center justify-center rounded-md border border-editor-border bg-white overflow-hidden"
        >
          <AlignDiagram :on="alignHeights" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-medium text-editor-text-default">
            {{ getEditorTranslation('align-heights') }}
          </div>
          <div class="text-2xs text-editor-text-faint leading-snug mt-0.5">
            {{ getEditorTranslation('align-heights-helper') }}
          </div>
        </div>
        <SfSwitch
          v-model="alignHeights"
          data-testid="align-heights"
          class="checked:bg-editor-button checked:border-gray-500 hover:border-gray-700 hover:before:bg-gray-700"
        />
      </div>

      <div class="h-px bg-editor-border/60 mx-1" />

      <div class="flex items-center gap-3 py-2">
        <div
          class="flex-none w-11 h-9 flex items-center justify-center rounded-md border border-editor-border bg-white overflow-hidden"
        >
          <FullWidthDiagram :on="isFullWidth" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-medium text-editor-text-default flex items-center gap-1">
            {{ getEditorTranslation('full-width') }}
            <SfTooltip v-if="!isTopLevelBlock" :label="getEditorTranslation('full-width-tooltip')" placement="top">
              <SfIconInfo size="xs" class="text-editor-text-faint align-middle" />
            </SfTooltip>
          </div>
          <div class="text-2xs text-editor-text-faint leading-snug mt-0.5">
            {{ getEditorTranslation('full-width-helper') }}
          </div>
        </div>
        <SfSwitch
          v-model="isFullWidth"
          :disabled="!isTopLevelBlock"
          data-testid="full-width"
          class="checked:bg-editor-button checked:border-gray-500 hover:border-gray-700 hover:before:bg-gray-700"
        />
      </div>
    </div>
  </EditorFormPanel>
</template>

<script setup lang="ts">
import type { ColumnBlock } from '~/components/blocks/structure/MultiGrid/types';
import { SfSwitch, SfTooltip, SfIconArrowUpward, SfIconArrowDownward, SfIconInfo } from '@storefront-ui/vue';
import MarginDiagram from './formDiagrams/MarginDiagram.vue';
import ReverseDiagram from './formDiagrams/ReverseDiagram.vue';
import AlignDiagram from './formDiagrams/AlignDiagram.vue';
import FullWidthDiagram from './formDiagrams/FullWidthDiagram.vue';

const props = defineProps<{
  uuid: string;
}>();

const open = ref(true);

const { allBlocks } = useBlocks();
const { findOrDeleteBlockByUuid, getBlockDepth } = useBlockManager();

const block = computed(() => findOrDeleteBlockByUuid(allBlocks.value, props.uuid) as ColumnBlock | null);
const configuration = computed(() => block.value?.configuration);
const layout = computed(() => configuration.value?.layout);

const isTopLevelBlock = computed(() => getBlockDepth(props.uuid) === 0);
const configurationForFullWidth = computed(() => configuration.value ?? { layout: undefined });
const { isFullWidth } = useFullWidthToggleForConfig(configurationForFullWidth);

const marginTop = computed({
  get: () => layout.value?.marginTop ?? 0,
  set: (value: number) => {
    if (layout.value) {
      layout.value.marginTop = value;
    }
  },
});

const marginBottom = computed({
  get: () => layout.value?.marginBottom ?? 0,
  set: (value: number) => {
    if (layout.value) {
      layout.value.marginBottom = value;
    }
  },
});

const reverseOnMobile = computed({
  get: () => layout.value?.reverseOnMobile ?? false,
  set: (value: boolean) => {
    if (layout.value) {
      layout.value.reverseOnMobile = value;
    }
  },
});

const alignHeights = computed({
  get: () => layout.value?.alignHeights ?? true,
  set: (value: boolean) => {
    if (layout.value) {
      layout.value.alignHeights = value;
    }
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "layout": "Layout",
    "vertical-margin": "Vertical margin",
    "reverse-on-mobile": "Reverse on mobile",
    "reverse-on-mobile-helper": "Flip column order on phones",
    "align-heights": "Align heights",
    "align-heights-helper": "Match all column heights",
    "full-width": "Full width",
    "full-width-helper": "Break out of page container",
    "full-width-tooltip": "Full width is only available for top-level blocks. This option is disabled for nested blocks (e.g., inside MultiGrid)."
  },
  "de": {
    "layout": "Layout",
    "vertical-margin": "Vertical margin",
    "reverse-on-mobile": "Reverse on mobile",
    "reverse-on-mobile-helper": "Flip column order on phones",
    "align-heights": "Align heights",
    "align-heights-helper": "Match all column heights",
    "full-width": "Full width",
    "full-width-helper": "Break out of page container",
    "full-width-tooltip": "Full width is only available for top-level blocks. This option is disabled for nested blocks (e.g., inside MultiGrid)."
  }
}
</i18n>
