<template>
  <SfTooltip :label="languageLabel" placement="bottom" :show-arrow="true">
    <div v-if="!loading" class="flex items-center space-x-1 md:space-x-2">
      <SfIconLanguage class="w-4 h-4 md:w-6 md:h-6" />
      <div class="relative flex items-center -space-x-2">
        <select
          :value="currentLocale"
          :style="{ width: selectWidth }"
          class="form-select focus:outline-none focus:ring-0 focus:border-transparent text-sm md:text-base appearance-none cursor-pointer bg-transparent"
          data-testid="editor-language-select"
          @input="(ev: any) => switchLanguage(ev.target.value)"
        >
          <option
            v-for="locale in availableLocales"
            :key="locale"
            :value="locale"
            class="font-medium text-sm md:text-base"
          >
            {{ t(`lang.${locale}`) }}
          </option>
        </select>
        <SfIconExpandMore class="w-4 h-4 md:w-6 md:h-6 flex-shrink-0" />
      </div>
    </div>
    <div ref="measureRef" class="absolute invisible whitespace-nowrap font-medium text-sm md:text-base">
      {{ t(`lang.${currentLocale}`) }}
    </div>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfIconLanguage, SfIconExpandMore, SfTooltip } from '@storefront-ui/vue';
import type { Locale } from 'vue-i18n';

const languageLabel = 'Change the active language to manage multilingual content.';

const { locale: currentLocale, availableLocales } = useI18n();
const { switchLocale } = useLocalization();

const loading = ref(true);
const measureRef = ref<HTMLElement>();
const selectWidth = ref('auto');

const updateWidth = async () => {
  await nextTick();
  if (measureRef.value) {
    /**
     * Add 5px to the measured width to provide extra space for the dropdown arrow
     * and prevent text clipping.
     */
    selectWidth.value = `${measureRef.value.offsetWidth + 5}px`;
  }
};

const switchLanguage = async (locale: Locale) => {
  await switchLocale(locale, false);
  await updateWidth();
};

onMounted(async () => {
  await nextTick();
  loading.value = false;
  await updateWidth();
});
</script>
