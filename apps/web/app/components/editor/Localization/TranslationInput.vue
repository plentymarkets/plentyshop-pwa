<template>
  <div class="w-64 flex-shrink-0 m-1 mr-2 group relative">
    <textarea
      v-if="translation?.input !== undefined"
      :id="`translation-${rowKey}-${lang}`"
      :value="localValue"
      class="p-2 h-10 resize-none border rounded-lg w-full text-xs absolute"
      @input="onInput"
    />
    <SfTooltip
      v-show="isDefaultValue"
      :label="getEditorTranslation('default-tooltip')"
      class="top-1 right-0 h-8 z-10 !absolute hidden group-hover:block"
      strategy="absolute"
      :show-arrow="true"
      placement="right"
    >
      <div class="right-1 p-2 h-8 bg-neutral-100 text-xs rounded-lg absolute text-gray-700">
        {{ getEditorTranslation('default') }}
      </div>
    </SfTooltip>
    <SfTooltip
      v-show="hasCustomValue"
      :label="getEditorTranslation('revert-to-default')"
      class="right-0 z-10 !absolute hidden group-hover:block"
      strategy="absolute"
      :show-arrow="true"
      placement="right"
    >
      <div class="h-10 p-2 flex items-center cursor-pointer" @click="onRevert">
        <SfIconBase viewBox="0 -960 960 960" size="xs" class="fill-none">
          <path
            fill="rgb(var(--colors-2-primary-500) / 1)"
            d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </SfIconBase>
      </div>
    </SfTooltip>
  </div>
</template>

<script setup lang="ts">
import { SfIconBase, SfTooltip } from '@storefront-ui/vue';
import { useDebounceFn } from '@vueuse/core';
import type { TranslationInputProps, TranslationInputEmits } from './types';

const props = defineProps<TranslationInputProps>();
const emit = defineEmits<TranslationInputEmits>();
const localValue = ref(props.translation?.input ?? '');

watch(
  () => props.translation?.input,
  (newValue) => {
    if (newValue !== undefined && newValue !== localValue.value) localValue.value = newValue;
  },
);

const isDefaultValue = computed(() => localValue.value === props.translation?.default);
const hasCustomValue = computed(() => !!props.translation?.default && localValue.value !== props.translation.default);

const debouncedEmit = useDebounceFn((value: string) => {
  emit('update', props.rowKey, props.lang, value);
}, 300);

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  localValue.value = target.value;
  debouncedEmit(target.value);
};

const onRevert = () => {
  if (props.translation) emit('revert', props.rowKey, props.lang, props.translation);
};
</script>

<i18n lang="json">
{
  "en": {
    "default": "Default",
    "default-tooltip": "This translation is a default value that you can override",
    "revert-to-default": "Revert to default"
  },
  "de": {
    "default": "Default",
    "default-tooltip": "This translation is a default value that you can override",
    "revert-to-default": "Revert to default"
  }
}
</i18n>
