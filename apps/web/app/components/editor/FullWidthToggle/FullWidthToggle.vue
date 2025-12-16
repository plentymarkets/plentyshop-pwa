<template>
  <div class="py-2">
    <div class="flex items-center justify-between">
      <UiFormLabel class="mb-1 flex items-center gap-1">
        {{ getEditorTranslation('full-width') }}
        <template v-if="!isTopLevel">
          <SfTooltip :label="getEditorTranslation('full-width-tooltip')" placement="top">
            <SfIconInfo size="base" class="text-gray-500 align-middle" />
          </SfTooltip>
        </template>
      </UiFormLabel>
      <SfSwitch
        :model-value="modelValue"
        :disabled="!isTopLevel"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FullWidthToggleProps } from './types';
import { SfSwitch, SfTooltip, SfIconInfo } from '@storefront-ui/vue';

const props = defineProps<FullWidthToggleProps & { blockUuid: string }>();
const emit = defineEmits(['update:modelValue']);

const { getBlockDepth } = useBlockManager();

const isTopLevel = computed(() => getBlockDepth(props.blockUuid) === 0);
</script>

<i18n lang="json">
{
  "en": {
    "full-width": "Enable full width",
    "full-width-tooltip": "Full width is only available for top-level blocks. This option is disabled for nested blocks (e.g., inside MultiGrid)."
  },
  "de": {
    "full-width": "Volle Breite aktivieren",
    "full-width-tooltip": "Volle Breite ist nur für oberste Blöcke verfügbar. Diese Option ist für verschachtelte Blöcke (z. B. innerhalb von MultiGrid) deaktiviert."
  }
}
</i18n>
