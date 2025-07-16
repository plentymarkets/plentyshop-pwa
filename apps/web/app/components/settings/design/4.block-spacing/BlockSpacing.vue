<template>
  <div class="">
    <div class="border-b py-1">
      <button
        v-for="(blocksSpacingSize, key) in blocksSpacingSizes"
        :key="key"
        type="button"
        data-testid="block-spacing-btn"
        :class="[btnClasses, { 'bg-editor-button text-white': blocksSpacingSize === blockSize }]"
        @click="updateSetting(blocksSpacingSize)"
      >
        {{ blocksSpacingSize }}
      </button>
    </div>
    <div class="px-4 py-3">
      <span class="typography-text-xs text-neutral-700">Spacing between blocks: {{ spacingInPx }}px</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { _l, _m, _s, _xl } from '#tailwind-config/theme/spacing';

const { updateSetting, getSetting } = useSiteSettings('blockSize');

const btnClasses = ref(
  'py-2 leading-6 px-4 gap-2 !hover:bg-gray-100 uppercase inline-flex items-center justify-center font-medium text-base focus-visible:outline focus-visible:outline-offset rounded-md disabled:text-disabled-500 disabled:bg-disabled-300 disabled:shadow-none disabled:ring-0 disabled:cursor-not-allowed',
);

const blocksSpacingSizes = ref(['s', 'm', 'l', 'xl']);

const blockSize = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const spacingInPx = computed(() => {
  if (!blockSize.value) return '0';

  const sizeMap: Record<string, string> = {
    s: _s,
    m: _m,
    l: _l,
    xl: _xl,
  };

  const remValue = parseFloat(sizeMap[blockSize.value] || '0');
  return remValue * 16;
});
</script>
