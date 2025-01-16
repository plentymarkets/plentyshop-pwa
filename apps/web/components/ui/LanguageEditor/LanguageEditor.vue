<template>
  <div
    class="flex items-center space-x-1 md:space-x-2"
    :class="{ 'opacity-40 cursor-not-allowed': isEditing || disableActions }"
  >
    <SfIconLanguage class="w-4 h-4 md:w-6 md:h-6" />
    <div class="relative">
      <select
        v-model="currentLocale"
        class="form-select focus:outline-none focus:ring-0 focus:border-transparent text-sm md:text-base appearance-none pr-4"
        style="
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuNzA3MTcsNC4yOTI4N0w4LjAwMDAxLDEwLjU4NTdsNi4yOTI4My02LjI5Mjg3IiBzdHJva2U9IiMwNjI2MzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K')
            no-repeat right 0.35rem center;
          background-size: 12px 12px;
        "
        :disabled="isEditing || disableActions"
        :class="{ 'cursor-not-allowed': isEditing || disableActions }"
        data-testid="editor-language-select"
        @change="switchLanguage(currentLocale)"
      >
        <option v-for="locale in localeCodes" :key="locale" :value="locale" class="font-medium text-sm md:text-base">
          {{ $t(`lang.${locale}`) }}
        </option>
      </select>
    </div>
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
