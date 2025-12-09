<template>
  <div class="flex ml-3 gap-1 flex-shrink-0 items-center">
    <SfTooltip :label="getEditorTranslation('reset')" strategy="absolute" :show-arrow="true" placement="top">
      <UiButton variant="secondary" class="!px-2" :disabled="!hasChanges" @click="reset">
        <SfIconBase viewBox="0 -960 960 960" size="sm" class="fill-none">
          <path
            fill="rgb(var(--colors-2-primary-500) / 1)"
            d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"
          />
        </SfIconBase>
      </UiButton>
    </SfTooltip>
    <SfTooltip :label="getEditorTranslation('export')" strategy="absolute" :show-arrow="true" placement="top">
      <UiButton variant="secondary" class="!px-2" @click="handleExportFile">
        <SfIconDownload size="sm" />
      </UiButton>
    </SfTooltip>
    <SfTooltip :label="getEditorTranslation('import')" strategy="absolute" :show-arrow="true" placement="top">
      <UiButton variant="secondary" class="!px-2" @click="openFileDialog">
        <SfIconUpload size="sm" />
      </UiButton>
      <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="handleFileSelect" />
    </SfTooltip>
  </div>
</template>

<script setup lang="ts">
import { SfIconDownload, SfIconUpload, SfTooltip, SfIconBase } from '@storefront-ui/vue';

const fileInput = ref<HTMLInputElement | null>(null);
const { keys, checkHasUnsavedChanges, hasChanges, importFile, exportFile } = useEditorLocalizationKeys();
const openFileDialog = () => {
  fileInput.value?.click();
};

const reset = () => {
  keys.value.forEach((key) => {
    Object.keys(key.translations).forEach((lang) => {
      if (!key.translations[lang]) return;
      if (key.translations?.[lang]?.value !== key.translations?.[lang]?.input) {
        key.translations[lang].input = key.translations[lang].value;
      }
    });
  });
  hasChanges.value = checkHasUnsavedChanges();
};

const handleExportFile = () => {
  exportFile('export.csv');
}

const handleFileSelect = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  const text: string = await file.text();
  importFile(text);
};
</script>

<i18n lang="json">
{
  "en": {
    "import": "Import",
    "export": "Export",
    "reset": "Reset"
  },
  "de": {
    "import": "Import",
    "export": "Export",
    "reset": "Reset"
  }
}
</i18n>