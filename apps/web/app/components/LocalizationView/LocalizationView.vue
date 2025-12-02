<template>
  <div class="pages-view sticky top-[52px] z-[2]" data-testid="localization-management-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        {{ getEditorTranslation('label') }}
      </div>
      <div class="flex items-center gap-2">
        <SfTooltip :label="getEditorTranslation('tooltip')" placement="right" :show-arrow="true" class="flex">
          <SfIconHelp class="cursor-pointer" />
        </SfTooltip>
        <button data-testid="pages-view-close" class="!p-0" @click="closeDrawer">
          <SfIconClose />
        </button>
      </div>
    </header>

    <p class="m-4">{{ getEditorTranslation('description') }}</p>

    <div>
      <UiAccordionItem
        v-model="editLanguagesOpen"
        data-testid="content-pages-section"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between select-none border-b"
      >
        <template #summary>
          <h2>{{ getEditorTranslation('shop-languages') }}</h2>
        </template>
        <EditorLocalizationShopLanguages />
      </UiAccordionItem>
      <UiAccordionItem
        v-model="editTranslationsOpen"
        data-testid="content-pages-section"
        summary-active-class="bg-neutral-100 border-t-0"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between select-none border-b"
      >
        <template #summary>
          <h2>{{ getEditorTranslation('edit-translations') }}</h2>
        </template>
        <EditorLocalizationLanguageSelect />
      </UiAccordionItem>
    </div>
  </div>
  <EditorLocalizationDrawer v-if="keys.length > 0 && drawerOpen" />
</template>

<script setup lang="ts">
import { SfIconClose, SfIconHelp, SfTooltip } from '@storefront-ui/vue';

const { keys, drawerOpen } = useEditorLocalizationKeys();
const { initializeLocales } = useEditorLocalizationLocales();

initializeLocales();
const { closeDrawer } = useSiteConfiguration();
const editTranslationsOpen = ref(false);
const editLanguagesOpen = ref(false);
</script>

<i18n lang="json">
{
  "en": {
    "label": "Localization",
    "description": "⚠️ These settings will require a shop redeploy to take effect.",
    "tooltip": "Manage translations for static texts inside the shop.",
    "edit-translations": "Edit translations",
    "shop-languages": "Shop languages"
  },
  "de": {
    "label": "Localization",
    "description": "⚠️ These settings will require a shop redeploy to take effect.",
    "tooltip": "Manage translations for static texts inside the shop.",
    "edit-translations": "Edit translations",
    "shop-languages": "Shop languages"
  }
}
</i18n>
