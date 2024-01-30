<template>
  <div
    v-if="isDesktop || isTablet"
    data-testid="languageSelectList"
    class="absolute w-full bg-white items-center py-10 justify-center flex align-middle z-10 drop-shadow-md"
    :class="{ 'top-[17,5%]': isDesktop, 'flex-col': !isDesktop }"
  >
    <template v-for="locale in localeCodes" :key="locale">
      <LanguageButton :locale="locale" :variant="locale === currentLocale ? 'primary' : 'tertiary'" class="ml-3 mb-2">
        <div :class="{ 'w-6': isDesktop, 'w-8': !isDesktop }" v-html="flagList[locale]" />
        <div>
          {{ $t(`lang.${locale}`) }}
        </div>
      </LanguageButton>
    </template>
  </div>

  <div v-else data-testid="languageSelectList">
    <UiModal v-model="isOpen" tag="section" class="!p-0 !pt-2.5 flex flex-col !w-11/12" aria-labelledby="login-modal">
      <template v-for="locale in localeCodes" :key="locale">
        <LanguageButton
          :locale="locale"
          variant="tertiary"
          class="ml-3 mb-2 flex items-center justify-between !text-black"
        >
          <div class="flex">
            <div :class="{ 'w-6': isDesktop, 'w-8': !isDesktop }" class="mr-2" v-html="flagList[locale]" />
            <div class="!text-black-500">
              {{ $t(`lang.${locale}`) }}
            </div>
          </div>
          <SfIconCheck class="text-green-500" v-if="locale === currentLocale" />
        </LanguageButton>
      </template>
    </UiModal>
  </div>
</template>
<script setup lang="ts">
import { SfIconCheck } from '@storefront-ui/vue';
import { flagImports } from './flags';

const { isOpen } = useLanguageSelect();

const { isDesktop, isTablet } = useBreakpoints();
const { localeCodes, locale: currentLocale } = useI18n();

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
</script>
