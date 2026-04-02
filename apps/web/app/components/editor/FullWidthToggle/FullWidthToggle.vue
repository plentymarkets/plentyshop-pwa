<template>
  <UiFieldToggle
    :model-value="modelValue"
    :label="getEditorTranslation('full-width')"
    :disabled="!isTopLevel"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="!isTopLevel" #info>
      <SfTooltip :label="getEditorTranslation('full-width-tooltip')" placement="top">
        <SfIconInfo size="base" class="text-gray-500 align-middle" />
      </SfTooltip>
    </template>
  </UiFieldToggle>
</template>

<script setup lang="ts">
import { SfTooltip, SfIconInfo } from '@storefront-ui/vue';
import type { FullWidthToggleProps } from './types';

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
    "full-width": "Enable full width",
    "full-width-tooltip": "Full width is only available for top-level blocks. This option is disabled for nested blocks (e.g., inside MultiGrid)."
  }
}
</i18n>
