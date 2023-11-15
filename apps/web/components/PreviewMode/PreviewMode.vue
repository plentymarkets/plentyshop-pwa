<template>
  <client-only>
    <div
      v-if="!bannerIsHidden"
      class="fixed z-50 w-full xl:w-auto xl:right-2 bottom-0 xl:bottom-14 shadow-2xl p-3 bg-white rounded overflow-auto top-0 sm:top-auto"
    >
      <div class="w-full flex flex-col xl:flex-row">
        <div class="flex-1">
          <SfButton
            v-for="(cookie, index) in foundCookies"
            :key="index"
            class="w-full"
            :class="{ 'mt-2': foundCookies.length > 1 && index !== 0 }"
            :aria-disabled="false"
            type="button"
            aria-label="button"
            @click="removeLookupCookie(index)"
          >
            {{ $t(`PreviewModeBar.${cookie}`) }}
          </SfButton>
        </div>
      </div>
    </div>

    <SfButton
      variant="secondary"
      class="z-10 fixed bottom-2 xl:bottom-2 xl:left-auto xl:right-20 bg-white !py-1"
      aria-label="Preview mode control"
      @click="setHiddenState(!bannerIsHidden)"
    >
      <SfRadio class="my-1.5" />
    </SfButton>
  </client-only>
</template>

<script setup lang="ts">
import { SfButton, SfRadio } from '@storefront-ui/vue';

const { bannerIsHidden, foundCookies, setHiddenState, removeLookupCookie } = usePreviewMode();
</script>
