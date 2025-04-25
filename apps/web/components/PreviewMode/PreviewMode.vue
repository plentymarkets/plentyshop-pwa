<template>
  <client-only>
    <div v-if="isPreview">
      <div
        v-if="!bannerIsHidden"
        class="fixed z-50 w-fit h-fit bottom-[7.3rem] md:bottom-14 left-2 xl:left-auto xl:right-2 shadow-2xl p-3 bg-white rounded overflow-auto"
      >
        <div v-if="hasUnsavedChanges()" class="w-full flex flex-col">
          <div class="mb-4 text-center typography-text-lg font-bold">
            <h2>{{ $t('previewModeBar.title') }}</h2>
          </div>
          <div
            class="flex items-start bg-warning-100 shadow-md pr-2 pl-4 ring-1 ring-warning-200 typography-text-sm md:typography-text-base py-1 rounded-md mb-4"
          >
            <SfIconWarning class="mt-2 mr-2 text-warning-700 shrink-0" />
            <span class="py-2 mr-2">
              <p>
                {{ $t(`previewModeBar.unsavedChangesWarning`) }}
              </p>
            </span>
          </div>
          <UiButton class="w-full my-2" @click="saveAndExit()">
            {{ $t(`previewModeBar.saveAndExit`) }}
          </UiButton>
          <UiButton
            variant="secondary"
            class="w-full"
            :aria-disabled="false"
            type="button"
            :aria-label="$t(`previewModeBar.exitWithoutSaving`)"
            @click="removeLookupCookie()"
          >
            {{ $t(`previewModeBar.exitWithoutSaving`) }}
          </UiButton>
        </div>

        <div v-else class="w-full flex flex-col">
          <UiButton class="w-full my-2" @click="removeLookupCookie()">
            {{ $t(`previewModeBar.exitEditor`) }}
          </UiButton>
        </div>
      </div>

      <UiButton
        variant="secondary"
        class="z-10 fixed bottom-[4.3rem] md:bottom-2 left-16 right-auto xl:right-16 xl:left-auto bg-white !py-1"
        :aria-label="$t('previewModeBar.label')"
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

const { isEditingEnabled } = useEditor();
const { settingsIsDirty } = useSiteConfiguration();
const { save: saveBlocksAndSiteSettings } = useToolbar();
const { save: saveCategorySettings, hasChanges } = useCategorySettingsCollection();

const bannerIsHidden = ref(true);
const isPreview = ref(false);
const config = useRuntimeConfig().public;
const showConfigurationDrawer = config.showConfigurationDrawer;

onMounted(() => {
  const pwaCookie = useCookie('pwa');
  isPreview.value = !!pwaCookie.value || (showConfigurationDrawer as boolean);
});

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
