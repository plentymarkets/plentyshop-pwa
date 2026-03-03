<template>
  <fieldset class="mb-3">
    <legend class="sr-only">{{ getEditorTranslation('colour-source') }}</legend>
    <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
      <button
        type="button"
        class="flex items-center justify-center w-1/2 px-3 py-1 cursor-pointer text-xs border-r"
        :class="{
          'bg-gray-100 text-gray-900 font-semibold': activeTab === 'shop',
        }"
        @click="setTab('shop')"
      >
        {{ getEditorTranslation('shop-colors') }}
      </button>
      <button
        type="button"
        class="flex items-center justify-center w-1/2 px-3 py-1 cursor-pointer text-xs"
        :class="{
          'bg-gray-100 text-gray-900 font-semibold': activeTab === 'picker',
        }"
        @click="setTab('picker')"
      >
        {{ getEditorTranslation('color-picker') }}
      </button>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
const props = defineProps<{
  activeTab: 'shop' | 'picker';
}>();

const emit = defineEmits<{
  (e: 'update:activeTab', v: 'shop' | 'picker'): void;
}>();

const setTab = (tab: 'shop' | 'picker') => {
  if (props.activeTab === tab) return;
  emit('update:activeTab', tab);
};
</script>

<i18n lang="json">
{
  "en": {
    "colour-source": "Color source",
    "shop-colors": "Shop colors",
    "color-picker": "Color Picker"
  },
  "de": {
    "colour-source": "Color source",
    "shop-colors": "Shop colors",
    "color-picker": "Color Picker"
  }
}
</i18n>
