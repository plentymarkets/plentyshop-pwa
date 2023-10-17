<template>
  <div class="w-full bg-white flex items-center py-10 justify-center flex-col shadow-xl md:hidden">
    <SfButton
      v-for="locale in localeCodes"
      :key="locale"
      :variant="buttonType(locale)"
      square
      :aria-label="$t('lang.' + locale)"
      @click="switchLocale(locale)"
      >{{ $t('lang.' + locale) }}</SfButton
    >
  </div>
  <div class="hidden md:flex w-full bg-white items-center py-10 justify-center absolute z-[99999] top-[10%] shadow-xl">
    <SfButton
      v-for="locale in localeCodes"
      :key="locale"
      :variant="buttonType(locale)"
      square
      class="ml-3"
      :aria-label="$t('lang.' + locale)"
      @click="switchLocale(locale)"
      >{{ $t('lang.' + locale) }}</SfButton
    >
  </div>
</template>
<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue';

const { setLocaleCookie, localeCodes, locale: currentLocale } = useI18n();
const route = useRoute();
const router = useRouter();
const switchLocalePath = useSwitchLocalePath();
const { toggle } = useLanguageSelect();

const buttonType = (localeCode: string) => {
  return localeCode === currentLocale.value ? 'primary' : 'tertiary';
};

const switchLocale = (language: string) => {
  setLocaleCookie(language);
  router.push({ path: switchLocalePath(language), query: route.query });
  toggle();
};
</script>
