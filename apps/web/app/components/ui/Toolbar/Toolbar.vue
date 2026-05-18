<template>
  <div
    :key="`${$route.meta?.identifier ?? ''}:${$route.meta?.type ?? ''}`"
    class="mb-3 font-editor"
    :class="['sticky top-0 bg-white h-[52px] shadow-[0px_15px_20px_-15px_#111]', drawerZIndexClass]"
    data-testid="edit-mode-toolbar"
  >
    <div class="relative flex items-center pr-5">
      <UiBrandLogo />
      <div class="absolute left-1/2 transform -translate-x-1/2 flex space-x-2">
        <UiLanguageEditor />
        <UiPageSelector />
      </div>
      <div class="ml-auto flex items-center space-x-2">
        <div v-if="disableActions" class="flex items-center rounded-md border border-gray-200 overflow-hidden">
          <SfTooltip label="Mobile (375px)" placement="bottom" :show-arrow="true">
            <button
              class="px-2 py-1.5 transition-colors"
              :class="currentDevice === 'mobile' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'"
              @click="handleSetDevice('mobile')"
            >
              <SfIconBase size="xs" viewBox="0 0 24 24" class="fill-current">
                <path d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
              </SfIconBase>
            </button>
          </SfTooltip>
          <SfTooltip label="Tablet (768px)" placement="bottom" :show-arrow="true">
            <button
              class="px-2 py-1.5 transition-colors border-l border-gray-200"
              :class="currentDevice === 'tablet' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'"
              @click="handleSetDevice('tablet')"
            >
              <SfIconBase size="xs" viewBox="0 0 24 24" class="fill-current">
                <path d="M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5S10.67 20 11.5 20s1.5.67 1.5 1.5S12.33 23 11.5 23zm7.5-3H4V3h15v17z" />
              </SfIconBase>
            </button>
          </SfTooltip>
          <SfTooltip label="Desktop" placement="bottom" :show-arrow="true">
            <button
              class="px-2 py-1.5 transition-colors border-l border-gray-200"
              :class="currentDevice === 'desktop' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:bg-gray-50'"
              @click="handleSetDevice('desktop')"
            >
              <SfIconBase size="xs" viewBox="0 0 24 24" class="fill-current">
                <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
              </SfIconBase>
            </button>
          </SfTooltip>
        </div>
        <button
          class="self-start text-[#062633] px-2 py-1 rounded-md font-inter font-medium text-sm leading-5 flex items-center md:px-4 md:py-2 md:text-base md:leading-6"
          data-testid="edit-preview-button"
          @click="toggleEdit"
        >
          <template v-if="disableActions">
            <SfTooltip :label="previewLabel" placement="bottom" :show-arrow="true">
              <SfIconVisibility class="mr-[5px] md:mr-[10px]" />
              {{ getEditorTranslation('preview') }}
            </SfTooltip>
          </template>
          <template v-else>
            <SfTooltip :label="editLabel" placement="bottom" :show-arrow="true">
              <SfIconBase size="xs" viewBox="0 0 18 18" class="mr-[5px] md:mr-[10px] fill-primary-900 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :d="editPath" fill="black" />
                </svg>
              </SfIconBase>
              {{ getEditorTranslation('edit') }}
            </SfTooltip>
          </template>
        </button>
        <SfTooltip
          :label="!isTouched || settingsLoading ? 'No changes to save.' : 'You have unsaved changes. Click to save.'"
          placement="bottom"
          :show-arrow="true"
        >
          <button
            class="self-start bg-[#062633] text-white px-2 py-1 rounded-md font-inter font-medium text-sm leading-5 flex items-center md:px-4 md:py-2 md:text-base md:leading-6"
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
import type { PreviewDevice } from '~/composables/useEditorPreview/useEditorPreview';
import { editPath } from '~/assets/icons/paths/edit';
import { savePath } from '~/assets/icons/paths/save';
import { deepEqual } from '~/utils/jsonHelper';

const previewLabel = 'Switch to Preview mode to see how your site will appear to visitors.';
const editLabel = 'Switch to Edit mode to modify your page content and layout.';

const { hasChanges: localizationHasChanges } = useEditorLocalizationKeys();
const { isEditing, isEditingEnabled, disableActions } = useEditor();
const { isDrawerOpen } = useDrawerState();

const { data, cleanData, loading, isSettling } = useBlocks();

const { closeDrawer } = useSiteConfiguration();
const { settingsIsDirty, loading: settingsLoading } = useSiteSettings();
const { assetsIsDirty } = useCustomAssets();

const { save } = useToolbar();

const isTouched = computed(
  () => assetsIsDirty.value || settingsIsDirty.value || isEditingEnabled.value || localizationHasChanges.value,
);

const toggleEdit = () => {
  disableActions.value = !disableActions.value;
  closeDrawer();
  if (isEditing.value) {
    isEditing.value = false;
  }
};

const { device: currentDevice, setDevice } = useEditorPreview();
const viewport = useViewport();

const handleSetDevice = (d: PreviewDevice) => {
  setDevice(d);
  if (d === 'mobile') {
    viewport.breakpoint.value = 'xs';
  } else if (d === 'tablet') {
    viewport.breakpoint.value = 'md';
  } else {
    // Restore the real breakpoint by checking actual window media queries
    for (const [key, { mediaQuery }] of Object.entries(viewport.queries.value)) {
      if (window.matchMedia(mediaQuery).matches) {
        viewport.breakpoint.value = key;
        break;
      }
    }
  }
};

const drawerZIndexClass = computed(() => (isDrawerOpen.value ? 'lg:z-20 md:z-10' : 'md:z-20'));

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
    "edit": "Edit"
  },
  "de": {
    "save-changes": "Save changes",
    "preview": "Preview",
    "edit": "Edit"
  }
}
</i18n>
