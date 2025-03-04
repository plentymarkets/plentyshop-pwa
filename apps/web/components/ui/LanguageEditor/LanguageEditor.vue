<template>
  <div class="relative">
    <button
      :class="{ 'opacity-40 cursor-not-allowed': isEditing || disableActions }"
      class="flex items-center space-x-1 md:space-x-2"
      :disabled="isEditing || disableActions"
      @click="toggleDropdown"
    >
      <SfIconLanguage class="w-4 h-4 md:w-6 md:h-6" />
      <span>{{ $t(`lang.${currentLocale}`) }}</span>
      <SfIconExpandMore class="w-4 h-4 md:w-6 md:h-6" />
    </button>
    <div v-if="isOpen" class="absolute bg-white py-2 mt-2 w-full z-10 drop-shadow-md rounded-md">
      <template v-for="locale in localeCodes" :key="locale">
        <LanguageButton
          :locale="locale"
          variant="tertiary"
          class="mx-3 mb-2 flex items-center justify-between !text-black"
        >
          <div class="flex">
            <div class="!text-black-500">{{ $t(`lang.${locale}`) }}</div>
          </div>
          <SfIconCheck v-if="locale === currentLocale" class="text-green-500" />
        </LanguageButton>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconLanguage, SfIconExpandMore, SfIconCheck } from '@storefront-ui/vue';
import { useI18n } from 'vue-i18n';

const { localeCodes, locale: currentLocale } = useI18n();
const { isEditing, disableActions } = useEditor();
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
</script>
