<template>
  <div
    v-if="viewport.isGreaterOrEquals('md') && isOpen"
    data-testid="languageSelectList"
    class="absolute w-full bg-white py-10 flex flex-row items-center justify-center z-10 drop-shadow-md"
  >
    <UiModal v-model="isOpen" tag="section" class="w-full bg-white !max-h-fit relative !rounded-none">
      <div class="flex justify-center">
        <div v-for="locale in localeCodes" :key="locale">
          <LanguageButton :locale="locale" :variant="locale === currentLocale ? 'primary' : 'tertiary'">
            <div class="w-6 lg:w-8" v-html="flagList[locale]" />
            <div>{{ $t(`lang.${locale}`) }}</div>
          </LanguageButton>
        </div>
      </div>
    </UiModal>
  </div>

  <div v-else data-testid="languageSelectList">
    <UiModal v-model="isOpen" tag="section" class="!p-0 !pt-2.5 flex flex-col !w-11/12" aria-labelledby="login-modal">
      <template v-for="locale in localeCodes" :key="locale">
        <LanguageButton
          :locale="locale"
          variant="tertiary"
          class="mx-3 mb-2 flex items-center justify-between !text-black"
        >
          <div class="flex">
            <div class="mr-2 w-8" :data-testid="`flagIcon-${locale}`" v-html="flagList[locale]" />
            <div class="!text-black-500">{{ $t(`lang.${locale}`) }}</div>
          </div>
          <SfIconCheck v-if="locale === currentLocale" class="text-green-500" />
        </LanguageButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { SfIconCheck } from '@storefront-ui/vue';
import { flagImports } from './flags';

const { isOpen } = useLocalization();
const viewport = useViewport();
const { localeCodes, locale: currentLocale } = useI18n();
const { getCategoryTree } = useCategoryTree();
const flagList: { [key: string]: string } = {};

localeCodes.value.forEach((localeCode) => {
  if (flagImports[localeCode]) flagList[localeCode] = flagImports[localeCode];
});

watch(
  () => currentLocale.value,
  async () => {
    await getCategoryTree();
  },
);
</script>
