<template>
  <client-only>
    <div v-if="isInEditor || isPreviewMode">
      <div
        v-if="!bannerIsHidden"
        class="fixed z-dropdown w-fit h-fit bottom-[7.3rem] @md:bottom-14 left-2 @xl:left-auto @xl:right-2 shadow-2xl p-3 bg-white rounded overflow-auto"
      >
        <div v-if="hasUnsavedChanges() && !isPreviewMode" class="w-full flex flex-col">
          <div class="mb-4 text-center typography-text-lg font-bold">
            <h2>{{ t('previewModeBar.title') }}</h2>
          </div>
          <div
            class="flex items-start bg-warning-100 shadow-md pr-2 pl-4 ring-1 ring-warning-200 typography-text-sm @md:typography-text-base py-1 rounded-md mb-4"
          >
            <SfIconWarning class="mt-2 mr-2 text-warning-700 shrink-0" />
            <span class="py-2 mr-2">
              <p>
                {{ t(`previewModeBar.unsavedChangesWarning`) }}
              </p>
            </span>
          </div>
          <UiButton class="w-full my-2" @click="saveAndExit()">
            {{ t(`previewModeBar.saveAndExit`) }}
          </UiButton>
          <UiButton
            variant="secondary"
            class="w-full"
            :aria-disabled="false"
            type="button"
            :aria-label="t(`previewModeBar.exitWithoutSaving`)"
            @click="removeLookupCookie()"
          >
            {{ t(`previewModeBar.exitWithoutSaving`) }}
          </UiButton>
        </div>

        <div v-else class="w-full flex flex-col p-2 gap-2">
          <div v-if="config.configId" class="p-2 bg-gray-100 rounded text-sm text-center">
            <span class="font-semibold">{{ t('previewModeBar.configId') }}</span> {{ config.configId }}
          </div>
          <UiButton v-if="isInEditor" class="w-full" @click="removeLookupCookie()">
            {{ t(`previewModeBar.exitEditor`) }}
          </UiButton>
          <UiButton v-if="isPreviewMode" class="w-full" @click="removeLookupCookie()">
            {{ t(`previewModeBar.exitPreviewMode`) }}
          </UiButton>
        </div>
      </div>

      <UiButton
        variant="secondary"
        class="z-dropdown fixed bottom-[4.3rem] @md:bottom-2 left-16 right-auto @xl:right-16 @xl:left-auto bg-white !py-1"
        :aria-label="t('previewModeBar.label')"
        @click="bannerIsHidden = !bannerIsHidden"
      >
        <NuxtImg width="32px" height="32px" :src="storeBlack" />
      </UiButton>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import storeBlack from '/assets/icons/paths/store-black.svg';
import { SfIconWarning } from '@storefront-ui/vue';
import type { RemoveLookupCookie } from './types';

const { isInEditor, isPreviewMode } = useEditorState();

const { isEditingEnabled } = useEditor();
const { settingsIsDirty } = useSiteSettings();
const { save: saveBlocksAndSiteSettings } = useToolbar();
const { save: saveCategorySettings, hasChanges } = useCategorySettingsCollection();

const bannerIsHidden = ref(true);
const config = useRuntimeConfig().public;

const hasUnsavedChanges = () => {
  return isEditingEnabled.value || settingsIsDirty.value || hasChanges.value;
};

const removeLookupCookie: RemoveLookupCookie = (): void => {
  const domain = config.domain.replace('https://', '');
  useCookie(defaults.PREVIEW_COOKIE, { path: '/', domain: domain }).value = null;
  bannerIsHidden.value = true;
  window.location.reload();
};

const saveAndExit = async (): Promise<void> => {
  await saveBlocksAndSiteSettings();
  await saveCategorySettings();
  removeLookupCookie();
};
</script>
