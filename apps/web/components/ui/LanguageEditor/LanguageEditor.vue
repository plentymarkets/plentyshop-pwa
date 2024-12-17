<template>
  <div class="flex items-center space-x-1 md:space-x-2">
    <SfIconLanguage class="w-4 h-4 md:w-6 md:h-6" />
    <select
      @change="switchLanguage(currentLocale)"
      class="form-select focus:outline-none focus:ring-0 focus:border-transparent text-sm md:text-base"
      v-model="currentLocale"
    >
      <option v-for="locale in localeCodes" :key="locale" :value="locale" class="font-medium text-sm md:text-base">
        {{ $t(`lang.${locale}`) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { SfIconLanguage } from '@storefront-ui/vue';
import { useI18n } from 'vue-i18n';

const { localeCodes, locale: currentLocale } = useI18n();
const { switchLocale } = useLocalization();

const switchLanguage = async (locale: string) => {
  await switchLocale(locale, false);
};
</script>
