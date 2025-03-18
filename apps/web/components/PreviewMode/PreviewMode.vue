<template>
  <client-only>
    <div v-if="foundCookies.length > 0">
      <div
        v-if="!bannerIsHidden"
        class="fixed z-50 w-fit h-fit bottom-[7.3rem] md:bottom-14 left-2 xl:left-auto xl:right-2 shadow-2xl p-3 bg-white rounded overflow-auto"
      >
        <div class="w-full flex flex-col">
          <UiButton
            v-for="(cookieName, index) in foundCookies"
            :key="index"
            class="w-full"
            :class="{ 'mt-2': useClassFor(index) }"
            :aria-disabled="false"
            type="button"
            aria-label="button"
            @click="removeLookupCookie(index)"
          >
            {{ $t(`previewModeBar.${cookieName}`) }}
          </UiButton>
        </div>
      </div>

      <UiButton
        variant="secondary"
        class="z-10 fixed bottom-[4.3rem] md:bottom-2 left-16 right-auto xl:right-16 xl:left-auto bg-white !py-1"
        :aria-label="$t('previewModeBar.label')"
        @click="removeLookupCookie(0)"
      >
      <NuxtImg width="32px" height="32px" :src='storeBlack' />
      </UiButton>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import storeBlack from '/assets/icons/paths/store-black.svg';
import type { RemoveLookupCookie } from './types';

const { isEditingEnabled } = useEditor();
const { settingsIsDirty } = useSiteConfiguration();

const hasUnsavedChanges = () => {
  return !isEditingEnabled.value && !settingsIsDirty.value;
};

const bannerIsHidden = ref(true);
const foundCookies = defaults.PREVIEW_COOKIES.filter((cookie) => !!useCookie(cookie).value);

const useClassFor = (index: number): boolean => foundCookies.length > 1 && index !== 0;

const removeLookupCookie: RemoveLookupCookie = (index: number): void => {
  if (hasUnsavedChanges()) return;
  
  const { public: config } = useRuntimeConfig();
  const domain = config.domain.replace('https://', '');
  useCookie(foundCookies[index], { path: '/', domain: domain }).value = null;
  bannerIsHidden.value = true;
  foundCookies.splice(index, 1);
  window.location.reload();
};
</script>
