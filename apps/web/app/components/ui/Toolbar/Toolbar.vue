<template>
  <div
    :key="`${$route.meta?.identifier ?? ''}:${$route.meta?.type ?? ''}`"
    class="mb-3 font-editor sticky top-0 bg-white h-[52px] shadow-[0px_15px_20px_-15px_#111] z-max"
    data-testid="edit-mode-toolbar"
  >
    <div class="relative flex items-center pr-5">
      <UiBrandLogo />
      <div class="absolute left-1/2 transform -translate-x-1/2 flex space-x-2">
        <UiLanguageEditor />
        <UiPageSelector />
        <UiToolbarDeviceToggle />
      </div>
      <div class="ml-auto flex space-x-2">
        <button
          class="self-start w-8 h-8 rounded-md font-inter font-medium text-sm leading-5 flex items-center justify-center xl:w-auto xl:h-auto xl:px-4 xl:py-2 xl:text-base xl:leading-6"
          :class="historyDrawerOpen ? 'bg-editor-button/10 text-editor-button' : 'text-editor-button'"
          data-testid="edit-history-button"
          :aria-label="getEditorTranslation('history')"
          @click="toggleHistoryDrawer"
        >
          <NuxtImg :src="historyBlack" width="16" height="16" class="block xl:mr-2" alt="" />
          <span class="hidden xl:inline">{{ getEditorTranslation('history') }}</span>
        </button>
        <button
          class="self-start text-editor-button w-8 h-8 rounded-md font-inter font-medium text-sm leading-5 flex items-center justify-center xl:w-auto xl:h-auto xl:px-4 xl:py-2 xl:text-base xl:leading-6"
          data-testid="edit-preview-button"
          :aria-label="disableActions ? getEditorTranslation('preview') : getEditorTranslation('edit')"
          @click="toggleEdit"
        >
          <template v-if="disableActions">
            <SfTooltip :label="previewLabel" placement="bottom" :show-arrow="true">
              <SfIconVisibility class="block xl:mr-2" />
              <span class="hidden xl:inline">{{ getEditorTranslation('preview') }}</span>
            </SfTooltip>
          </template>
          <template v-else>
            <SfTooltip :label="editLabel" placement="bottom" :show-arrow="true">
              <SfIconBase size="xs" viewBox="0 0 18 18" class="block xl:mr-2 fill-primary-900 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :d="editPath" fill="black" />
                </svg>
              </SfIconBase>
              <span class="hidden xl:inline">{{ getEditorTranslation('edit') }}</span>
            </SfTooltip>
          </template>
        </button>
        <SfTooltip
          :label="!isTouched || settingsLoading ? 'No changes to save.' : 'You have unsaved changes. Click to save.'"
          placement="bottom"
          :show-arrow="true"
        >
          <button
            class="self-start bg-editor-button text-white px-2 py-1 rounded-md font-inter font-medium text-sm leading-5 flex items-center md:px-4 md:py-2 md:text-base md:leading-6"
            :class="{ 'opacity-40 cursor-not-allowed': !isTouched || settingsLoading }"
            :disabled="!isTouched || settingsLoading"
            data-testid="edit-save-button"
            @click="save"
          >
            <template v-if="loading">
              <SfLoaderCircular class="animate-spin w-4 h-4 text-white mr-[5px] md:mr-[10px]" />
            </template>
            <template v-else>
              <SfIconBase size="xs" class="mr-[5px] md:mr-[10px]">
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :d="savePath" fill="white" />
                </svg>
              </SfIconBase>
            </template>
            {{ getEditorTranslation('save-changes') }}
          </button>
        </SfTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfLoaderCircular, SfIconBase, SfIconVisibility, SfTooltip } from '@storefront-ui/vue';
import { editPath } from '~/assets/icons/paths/edit';
import { savePath } from '~/assets/icons/paths/save';
import historyBlack from '~/assets/icons/paths/history-black.svg';

const previewLabel = 'Switch to Preview mode to see how your site will appear to visitors.';
const editLabel = 'Switch to Edit mode to modify your page content and layout.';

const { hasChanges: localizationHasChanges } = useEditorLocalizationKeys();
const { isEditing, isEditingEnabled, disableActions } = useEditor();

const { data, cleanData, loading, isSettling } = useBlocks();

const { closeDrawer } = useSiteConfiguration();
const { settingsIsDirty, loading: settingsLoading } = useSiteSettings();
const { assetsIsDirty } = useCustomAssets();

const { save } = useToolbar();
const {
  drawerOpen: historyDrawerOpen,
  toggleDrawer: toggleHistoryDrawer,
  closeDrawer: closeHistoryDrawer,
} = useBlockSnapshots();

const isTouched = computed(
  () => assetsIsDirty.value || settingsIsDirty.value || isEditingEnabled.value || localizationHasChanges.value,
);

const toggleEdit = () => {
  disableActions.value = !disableActions.value;
  closeDrawer();
  closeHistoryDrawer();
  if (isEditing.value) {
    isEditing.value = false;
  }
};

watch(
  () => data.value,
  () => {
    if (isSettling.value) return;
    isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
  },
  { deep: true },
);
</script>

<i18n lang="json">
{
  "en": {
    "save-changes": "Save changes",
    "preview": "Preview",
    "edit": "Edit",
    "history": "History"
  },
  "de": {
    "save-changes": "Save changes",
    "preview": "Preview",
    "edit": "Edit",
    "history": "History"
  }
}
</i18n>
