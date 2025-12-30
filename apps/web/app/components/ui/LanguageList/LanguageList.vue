<template>
  <div
    v-if="isOpen"
    class="absolute top-full mt-2 z-50 min-w-[10rem] rounded-lg border bg-white shadow-lg"
    role="listbox"
    tabindex="-1"
  >
    <button
      v-for="(locale, i) in filteredLocaleCodes"
      :key="locale"
      :data-testid="`language-option-${locale}`"
      type="button"
      class="w-full text-left px-3 py-2 text-sm md:text-base hover:bg-gray-100"
      :class="i === activeIndex ? 'bg-gray-100' : ''"
      role="option"
      :aria-selected="locale === currentLocale"
      @click="selectLocale(locale)"
      @mouseenter="$emit('active-index-change', i)"
    >
      {{ t(`lang.${locale}`) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from 'vue-i18n';

interface Props {
  isOpen?: boolean;
  activeIndex?: number;
}
const { send } = useNotification();

withDefaults(defineProps<Props>(), {
  isOpen: false,
  activeIndex: 0,
});

const emit = defineEmits<{
  'locale-selected': [locale: Locale | string];
  'active-index-change': [index: number];
}>();

const { localeCodes, locale: currentLocale, availableLocales } = useI18n();
const config = useRuntimeConfig();
const { switchLocale } = useLocalization();

const activeLanguages = (config.public.activeLanguages as string)
  .split(',')
  .filter((lang) => (availableLocales as string[]).includes(lang))
  .map((lang: string) => lang.trim());

const filteredLocaleCodes = computed(() =>
  localeCodes.value.filter((localeCode) => activeLanguages.includes(localeCode)),
);

const selectLocale = async (loc: Locale | string) => {
  try {
    await switchLocale(loc as Locale, false);
    emit('locale-selected', loc);
  } catch (error) {
    send({
      type: 'negative',
      message: `Failed to switch locale-${error}`,
    });
  }
};
</script>
