<template>
  <div>
    <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    <div class="border-b py-1">
      <button
        v-for="(blocksSpacingSize, key) in blocksSpacingSizes"
        :key="key"
        type="button"
        data-testid="block-spacing-btn"
        :class="[btnClasses, { 'bg-editor-button text-white': blocksSpacingSize === blockSize }]"
        @click="updateSetting(blocksSpacingSize)"
      >
        {{ getEditorTranslation('block-spacing-size-' + blocksSpacingSize) }}
      </button>
    </div>
    <div class="py-3">
      <span class="typography-text-xs text-neutral-700">
        {{ horizontalSpacingDescription }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { updateSetting, getSetting } = useSiteSettings('horizontalBlockSize');

const btnClasses = ref(
  'py-2 leading-6 px-4 gap-2 !hover:bg-gray-100 uppercase inline-flex items-center justify-center font-medium text-base focus-visible:outline focus-visible:outline-offset rounded-md disabled:text-disabled-500 disabled:bg-disabled-300 disabled:shadow-none disabled:ring-0 disabled:cursor-not-allowed',
);

const blocksSpacingSizes = ['s', 'm', 'l'];

const blockSize = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const horizontalSpacingDescription = computed(() => {
  const key = blockSize.value ?? 's';
  const map: Record<string, { bp: string; class: string }> = {
    s: { bp: '3xl', class: 'max-w-screen-3xl' },
    m: { bp: '2xl', class: 'max-w-screen-2xl' },
    l: { bp: 'xl', class: 'max-w-screen-xl' },
  };

  const entry = map[key] ?? map.s ?? { class: 'max-w-screen-3xl' };
  const description = `Sets container max-width to ${entry.class}. Applies on non-full-width blocks.`;
  return description;
});
</script>

<i18n lang="json">
{
  "en": {
    "block-spacing-size-s": "s",
    "block-spacing-size-m": "m",
    "block-spacing-size-l": "l",
    "block-spacing-size-xl": "xl",
    "spacing-between-blocks-horizontal": "Spacing between blocks (horizontal)",
    "label": "Horizontal spacing",
    "horizontal-spacing-description": "Sets container max-width to {class} (up to {bp}). Applies on non–full-width blocks with container enabled."
  },
  "de": {
    "block-spacing-size-s": "s",
    "block-spacing-size-m": "m",
    "block-spacing-size-l": "l",
    "block-spacing-size-xl": "xl",
    "spacing-between-blocks-horizontal": "Spacing between blocks (horizontal)",
    "label": "Horizontal spacing",
    "horizontal-spacing-description": "Setzt die Container-Maximalbreite auf {class} (bis {bp}). Gilt für nicht vollbreite Blöcke mit aktiviertem Container."
  }
}
</i18n>
