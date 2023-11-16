<template>
  <div data-testid="languageSelectList" :class="isDesktop ? 'desktopFlagLayout' : 'mobileFlagLayout'">
    <SfButton
      v-for="locale in localeCodes"
      :key="locale"
      :variant="locale === currentLocale ? 'primary' : 'tertiary'"
      square
      class="ml-3"
      :aria-label="$t('lang.' + locale)"
      :data-testid="`languageOption-${locale}`"
      @click="switchLocale(locale)"
    >
      <div :class="isDesktop ? 'desktopCountryFlags' : 'mobileCountryFlags'" v-html="flagList[locale]"></div>
      {{ $t('lang.' + locale) }}</SfButton
    >
  </div>
</template>
<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue';
import { flagImports } from './flags';
const { isDesktop } = useBreakpoints();
const { setLocaleCookie, localeCodes, locale: currentLocale } = useI18n();
const route = useRoute();
const switchLocalePath = useSwitchLocalePath();
const { toggle } = useLanguageSelect();

const flagList: { [key: string]: string } = {};

const dynamicFlagImport = async () => {
  for (const local of localeCodes.value) {
    const localLang = flagImports[local];
    if (localLang) {
      flagList[local] = localLang;
    }
  }
};
dynamicFlagImport();

const switchLocale = (language: string) => {
  setLocaleCookie(language);
  navigateTo({ path: switchLocalePath(language), query: route.query });
  toggle();
};
</script>

<style>
.desktopCountryFlags {
  width: 2vw;
}
.mobileCountryFlags {
  width: 10vw;
}
.desktopFlagLayout {
  @apply hidden md:flex w-full bg-white items-center py-10 justify-center absolute z-[99999] top-[10%] shadow-xl;
}
.mobileFlagLayout {
  @apply w-full bg-white flex items-center py-10 justify-center flex-col shadow-xl md:hidden;
}
</style>
