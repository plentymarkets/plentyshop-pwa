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

    <UiLanguageList
      :is-open="isOpen"
      :active-index="activeIndex"
      @locale-selected="handleLocaleSelected"
      @active-index-change="activeIndex = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { SfIconLanguage, SfIconExpandMore, SfTooltip } from '@storefront-ui/vue';

const languageLabel = 'Change the active language to manage multilingual content.';

const { locale: currentLocale, availableLocales, t } = useI18n();

const loading = ref(true);
const isOpen = ref(false);
const activeIndex = ref(0);
const root = ref<HTMLElement | null>(null);

const currentLabel = computed(() => t(`lang.${currentLocale.value}`));

const open = () => {
  isOpen.value = true;
  const idx = availableLocales.findIndex((language) => language === currentLocale.value);
  if (idx >= 0) {
    activeIndex.value = idx;
  }
};
const close = () => {
  isOpen.value = false;
  activeIndex.value = 0;
};
const toggle = () => (isOpen.value ? close() : open());

const handleLocaleSelected = async () => {
  close();
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
