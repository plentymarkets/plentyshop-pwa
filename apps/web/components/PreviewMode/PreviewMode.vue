<template>
  <client-only>
    <div v-if="foundCookies.length > 0">
      <div
        v-if="!bannerIsHidden"
        class="fixed z-50 w-full xl:w-auto xl:right-2 bottom-0 xl:bottom-14 shadow-2xl p-3 bg-white rounded overflow-auto top-0 sm:top-auto"
      >
        <div class="w-full flex flex-col">
          <SfButton
            v-for="(cookieName, index) in foundCookies"
            :key="index"
            class="w-full"
            :class="{ 'mt-2': useClassFor(index) }"
            :aria-disabled="false"
            type="button"
            aria-label="button"
            @click="removeLookupCookie(index)"
          >
            {{ $t(`PreviewModeBar.${cookieName}`) }}
          </SfButton>
        </div>
      </div>

      <SfButton
        variant="secondary"
        class="z-10 fixed bottom-2 xl:bottom-2 xl:left-auto xl:right-20 bg-white !py-1"
        :aria-label="$t('PreviewModeBar.label')"
        @click="bannerIsHidden = !bannerIsHidden"
      >
        <SfRadio class="my-1.5" />
      </SfButton>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { SfButton, SfRadio } from '@storefront-ui/vue';
import { RemoveLookupCookie } from './types';

const bannerIsHidden = ref(true);

const foundCookies = computed(() => defaults.PREVIEW_COOKIES.filter((cookie) => !!useCookie(cookie).value));

const useClassFor = (index: number): boolean => foundCookies.value.length > 1 && index !== 0;

const removeLookupCookie: RemoveLookupCookie = (index: number): void => {
  useCookie(foundCookies.value[index]).value = null;
  bannerIsHidden.value = true;
};
</script>
