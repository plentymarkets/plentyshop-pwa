<template>
  <div class="pages-view sticky z-editor-drawer h-full flex flex-col" data-testid="localization-management-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        {{ getEditorTranslation('label') }}
      </div>
      <div class="flex items-center gap-2">
        <SfTooltip :label="getEditorTranslation('tooltip')" placement="right" :show-arrow="true" class="flex">
          <SfIconHelp class="cursor-pointer" />
        </SfTooltip>
        <button data-testid="pages-view-close" class="!p-0" @click="handleClose">
          <SfIconClose />
        </button>
      </div>
    </header>

    <div class="flex-1 min-h-0 overflow-y-auto">
      <p class="m-4">{{ getEditorTranslation('description') }}</p>

      <EditorFormPanel
        v-model="editLanguagesOpen"
        :title="getEditorTranslation('shop-languages')"
        data-testid="content-pages-section"
      >
        <EditorLocalizationShopLanguages />
      </EditorFormPanel>
      <EditorFormPanel
        v-model="editTranslationsOpen"
        :title="getEditorTranslation('edit-translations')"
        data-testid="content-pages-section"
      >
        <EditorLocalizationLanguageSelect />
      </EditorFormPanel>
    </div>
  </div>
  <Teleport to="body">
    <EditorLocalizationDrawer v-if="keys.length > 0 && drawerOpen" />
  </Teleport>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconHelp, SfTooltip } from '@storefront-ui/vue';

const { keys, drawerOpen } = useEditorLocalizationKeys();
const { initializeLocales } = useEditorLocalizationLocales();

initializeLocales();
const { closeSiteConfigurationDrawer } = useSiteConfiguration();
const editTranslationsOpen = ref(false);
const editLanguagesOpen = ref(false);

const handleClose = () => {
  closeSiteConfigurationDrawer();
  drawerOpen.value = false;
};
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
