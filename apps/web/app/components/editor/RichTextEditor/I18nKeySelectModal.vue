<template>
  <UiOverlay :visible="true" class="fixed inset-0 z-modal-backdrop bg-black/40">
    <SfModal
      :model-value="true"
      class="!w-[520px] !max-w-[90vw] !max-h-[90vh] !p-0 !rounded-xl !border !border-neutral-200 !shadow-md flex flex-col !bg-white !absolute !top-20 !left-1/2 !-translate-x-1/2 !m-0 !overflow-hidden"
      @update:model-value="handleModalChange"
    >
      <div class="flex w-full items-center justify-between px-5 py-4 border-b border-neutral-200">
        <h2 class="typography-headline-4 font-medium">{{ getEditorTranslation('modal-title') }}</h2>

        <UiButton
          :aria-label="getEditorTranslation('close-modal-aria')"
          size="sm"
          square
          type="button"
          variant="tertiary"
          @click="close"
        >
          <SfIconClose size="sm" />
        </UiButton>
      </div>

      <div class="w-full px-5 py-3 border-b border-neutral-200">
        <SfInput
          id="i18n-key-search"
          v-model="searchQuery"
          :placeholder="getEditorTranslation('search-placeholder')"
          size="sm"
        >
          <template #prefix>
            <SfIconSearch class="text-neutral-400" size="sm" />
          </template>
          <template v-if="searchQuery" #suffix>
            <button aria-label="Clear search" class="text-neutral-400 hover:text-neutral-600" type="button" @click="searchQuery = ''">
              <SfIconClose size="sm" />
            </button>
          </template>
        </SfInput>
      </div>

      <div class="w-full overflow-y-auto flex-1">
        <div v-if="loading" class="px-5 py-8 text-center typography-text-sm text-neutral-400">
          {{ getEditorTranslation('loading-keys') }}
        </div>

        <div
          v-else-if="filteredAvailableKeys.length === 0"
          class="px-5 py-8 text-center typography-text-sm text-neutral-400"
        >
          {{ getEditorTranslation('no-results', { query: searchQuery }) }}
        </div>

        <template v-else>
          <button
            v-for="(entry, index) in filteredAvailableKeys"
            :key="entry.key"
            :ref="(element) => setOptionRef(element, index)"
            :class="{
              'bg-cyan-50 ring-1 ring-inset ring-cyan-300': index === selectedIndex,
            }"
            class="w-full px-5 py-3 border-b border-neutral-100 last:border-b-0 text-left hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none"
            type="button"
            @focus="selectedIndex = index"
            @click="insertKey(entry.key)"
          >
            <span class="flex items-start gap-3">
              <span
                class="mt-0.5 inline-flex items-center rounded-sm border border-cyan-300 bg-cyan-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-cyan-800"
              >
                i18n
              </span>
              <span class="min-w-0 flex-1">
                <span class="block typography-text-sm font-medium text-neutral-800 break-words">{{ entry.key }}</span>
                <span class="mt-1 block typography-text-xs text-neutral-500 truncate">{{
                  getTranslationPreview(entry)
                }}</span>
              </span>
            </span>
          </button>
        </template>
      </div>

      <div class="w-full px-5 py-3 border-t border-neutral-200 flex items-center justify-between gap-3">
        <span class="typography-text-xs text-neutral-400">
          {{ getEditorTranslation('keys-count', { count: filteredAvailableKeys.length }) }}
        </span>
        <UiButton size="sm" type="button" variant="secondary" @click="close">
          {{ getEditorTranslation('cancel') }}
        </UiButton>
      </div>
    </SfModal>
  </UiOverlay>
</template>

<script lang="ts" setup>
import { SfIconClose, SfIconSearch, SfInput, SfModal } from '@storefront-ui/vue';
import type { LocalizationMessage } from '@plentymarkets/shop-core';
import type { I18nPlaceholderToken } from '~/composables/useRichTextEditor/types';
import type { LocalizationKeyEntry } from './types';

const emit = defineEmits<{
  insert: [token: I18nPlaceholderToken];
  close: [];
}>();

const { locale } = useI18n();
const { selectedLocales, initializeLocales } = useEditorLocalizationLocales();
const { keys, loading, loadKeys, drawerOpen } = useEditorLocalizationKeys();
const searchQuery = ref('');
const selectedIndex = ref(0);
const optionRefs = ref<HTMLElement[]>([]);

const activeLocale = computed(() => locale.value || selectedLocales.value[0] || 'en');

const getTranslationValue = (message?: LocalizationMessage): string => {
  return message?.input || message?.value || message?.default || '';
};

const getTranslationPreview = (entry: LocalizationKeyEntry): string => {
  const activeTranslation = getTranslationValue(entry.translations[activeLocale.value]);
  if (activeTranslation) return activeTranslation;

  for (const translation of Object.values(entry.translations)) {
    const value = getTranslationValue(translation);
    if (value) return value;
  }

  return getEditorTranslation('missing-translation-preview');
};

const filteredAvailableKeys = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const availableKeys = keys.value as LocalizationKeyEntry[];

  if (!query) return availableKeys;

  return availableKeys.filter((entry) => {
    const preview = getTranslationPreview(entry).toLowerCase();
    return entry.key.toLowerCase().includes(query) || preview.includes(query);
  });
});

const setOptionRef = (element: unknown, index: number) => {
  if (element instanceof HTMLElement) {
    optionRefs.value[index] = element;
  }
};

const scrollSelectedOptionIntoView = () => {
  optionRefs.value[selectedIndex.value]?.scrollIntoView({ block: 'nearest' });
};

const selectRelativeOption = (direction: 1 | -1) => {
  const optionsCount = filteredAvailableKeys.value.length;
  if (optionsCount === 0) return;

  selectedIndex.value = (selectedIndex.value + direction + optionsCount) % optionsCount;
  nextTick(scrollSelectedOptionIntoView);
};

const insertSelectedKey = () => {
  const selectedKey = filteredAvailableKeys.value[selectedIndex.value]?.key;
  if (selectedKey) insertKey(selectedKey);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    selectRelativeOption(1);
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    selectRelativeOption(-1);
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    insertSelectedKey();
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    close();
  }
};

const insertKey = (key: string) => {
  emit('insert', { key, label: key });
  close();
};

const close = () => emit('close');

const handleModalChange = (isOpen: boolean) => {
  if (!isOpen) close();
};

onMounted(async () => {
  document.addEventListener('keydown', handleKeydown);
  initializeLocales();
  const wasDrawerOpen = drawerOpen.value;

  if (keys.value.length === 0) {
    try {
      await loadKeys();
    } finally {
      drawerOpen.value = wasDrawerOpen;
    }
  }

  nextTick(() => {
    document.getElementById('i18n-key-search')?.focus();
  });
});

onBeforeUpdate(() => {
  optionRefs.value = [];
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
});

watch(filteredAvailableKeys, () => {
  selectedIndex.value = 0;
  nextTick(scrollSelectedOptionIntoView);
});
</script>

<i18n lang="json">
{
  "en": {
    "modal-title": "i18n keys",
    "close-modal-aria": "Close modal",
    "search-placeholder": "Search i18n keys...",
    "loading-keys": "Loading i18n keys...",
    "no-results": "No i18n keys found for \"{query}\"",
    "missing-translation-preview": "No translation value available",
    "keys-count": "{count} key(s)",
    "cancel": "Cancel"
  },
  "de": {
    "modal-title": "i18n keys",
    "close-modal-aria": "Close modal",
    "search-placeholder": "Search i18n keys...",
    "loading-keys": "Loading i18n keys...",
    "no-results": "No i18n keys found for \"{query}\"",
    "missing-translation-preview": "No translation value available",
    "keys-count": "{count} key(s)",
    "cancel": "Cancel"
  }
}
</i18n>
