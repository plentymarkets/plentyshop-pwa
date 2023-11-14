<template>
  <client-only>
    <div
      v-if="!hideBanner"
      class="fixed z-50 w-full xl:w-auto xl:right-2 bottom-0 xl:bottom-2 shadow-2xl p-3 bg-white rounded overflow-auto top-0 sm:top-auto"
    >
      <div class="w-full flex flex-col xl:flex-row mt-5 gap-2 mb-2">
        <div class="flex-1">
          <SfButton
            class="w-full"
            :aria-disabled="false"
            type="button"
            aria-label="button"
            @click="setHiddenState(true)"
          >
            {{ $t('PreviewModeBar.Deactivate PWA preview') }}
          </SfButton>
        </div>
      </div>
    </div>

    <SfButton
      v-else
      variant="secondary"
      class="z-10 fixed bottom-2 xl:bottom-2 xl:left-auto xl:right-20 bg-white text-red-700 ring-red-700"
      aria-label="Preview mode control"
      @click="setHiddenState(false)"
    >
      <SfIconCheckBox />
    </SfButton>
  </client-only>
</template>

<script setup lang="ts">
const { bannerIsHidden, setHiddenState } = usePreviewMode(useCookie('consent-cookie'));

const hideBanner = computed(() => {
  return bannerIsHidden.value;
});
</script>
