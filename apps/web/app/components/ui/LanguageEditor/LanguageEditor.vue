<template>
  <div v-if="!loading" ref="root" class="relative flex items-center space-x-1 md:space-x-2">
    <SfTooltip :label="languageLabel" placement="left" :show-arrow="true">
      <button
        type="button"
        class="flex items-center focus:outline-none"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        @click="toggle"
      >
        <SfIconLanguage class="w-4 h-4 md:w-6 md:h-6" />
        <span class="text-sm md:text-base">
          {{ currentLabel }}
        </span>
        <SfIconExpandMore class="w-4 h-4 md:w-6 md:h-6" />
      </button>
    </SfTooltip>

    <div
      v-if="isOpen"
      class="absolute top-full mt-2 z-50 min-w-[10rem] rounded-lg border bg-white shadow-lg"
      role="listbox"
      tabindex="-1"
    >
      <button
        v-for="(locale, i) in availableLocales"
        :key="locale"
        type="button"
        class="w-full text-left px-3 py-2 text-sm md:text-base hover:bg-gray-100"
        :class="i === activeIndex ? 'bg-gray-100' : ''"
        role="option"
        :aria-selected="locale === currentLocale"
        @click="selectLocale(locale)"
        @mouseenter="activeIndex = i"
      >
        {{ t(`lang.${locale}`) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconLanguage, SfIconExpandMore, SfTooltip } from '@storefront-ui/vue';
import type { Locale } from 'vue-i18n';

const languageLabel = 'Change the active language to manage multilingual content.';

const { locale: currentLocale, availableLocales, t } = useI18n();
const { switchLocale } = useLocalization();

const loading = ref(true);
const isOpen = ref(false);
const activeIndex = ref(0);
const root = ref<HTMLElement | null>(null);

const currentLabel = computed(() => t(`lang.${currentLocale.value}`));

const open = () => {
  isOpen.value = true;
  const idx = availableLocales.findIndex((language) => language === currentLocale.value);
  activeIndex.value = Math.max(0, idx);
};
const close = () => (isOpen.value = false);
const toggle = () => (isOpen.value ? close() : open());

const selectLocale = async (loc: Locale | string) => {
  close();
  await switchLocale(loc as Locale, false);
};

const clickOutside = (e: MouseEvent) => {
  if (!isOpen.value) return;
  const el = root.value;
  if (el && !el.contains(e.target as Node)) close();
};

onMounted(async () => {
  await nextTick();
  loading.value = false;
  document.addEventListener('mousedown', clickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', clickOutside);
});
</script>
