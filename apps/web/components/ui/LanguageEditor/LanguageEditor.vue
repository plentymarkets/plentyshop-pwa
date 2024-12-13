<template>
  <div class="flex items-center space-x-2">
    <SfIconLanguage />
    <select
      @change="switchLanguage(currentLocale)"
      class="form-select focus:outline-none focus:ring-0 focus:border-transparent"
      v-model="currentLocale"
      :disabled="isEditing || disableActions"
    >
      <option v-for="locale in localeCodes" :key="locale" :value="locale" class="font-medium text-base">
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
const { isEditing, disableActions } = useEditor();

const switchLanguage = async (locale: string) => {
  await switchLocale(locale, false);
};
</script>
