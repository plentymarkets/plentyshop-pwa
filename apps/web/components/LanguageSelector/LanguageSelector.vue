<template>
  <div
    data-testid="languageSelectList"
    class="w-full bg-white items-center py-10 justify-center flex"
    :class="{ 'top-[10%]': isDesktop, 'flex-col': !isDesktop }"
  >
    <SfButton
      v-for="locale in localeCodes"
      :key="locale"
      :variant="locale === currentLocale ? 'primary' : 'tertiary'"
      square
      class="ml-3 mb-2"
      :aria-label="$t(`lang.${locale}`)"
      :data-testid="`languageOption-${locale}`"
      @click="switchLocale(locale)"
    >
      <div :class="{ 'w-6': isDesktop, 'w-8': !isDesktop }" v-html="flagList[locale]"></div>
      <div>
        {{ $t(`lang.${locale}`) }}
      </div>
    </SfButton>
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
