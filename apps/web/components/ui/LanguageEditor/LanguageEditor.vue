<template>
  <div
    class="flex items-center space-x-1 md:space-x-2 "
    :class="{ 'opacity-40 cursor-not-allowed': isEditing || disableActions }"
  >
    <div class="relative flex items-center">
      <SfDropdown v-model="isOpen">
        <template #trigger>
          <UiButton
            :variant="'tertiary'"
            class="hover:bg-white focus:bg-white target:bg-white active:bg-white"
            @click="toggle()"
          >
            <template #prefix>
              <SfIconLanguage />
            </template>
            <template #suffix>
              <SfIconExpandMore />
            </template>
            {{ t(`lang.${currentLocale}`) }}
          </UiButton>
        </template>
        <ul class="p-2 rounded bg-white">
          <li v-for="locale in localeCodes" :key="locale">
            <LanguageButton
              :locale="locale"
              :variant="'tertiary'"
              class="hover:bg-white focus:bg-white target:bg-white active:bg-white"
            >
              <div>{{ t(`lang.${locale}`) }}</div>
            </LanguageButton>
          </li>
        </ul>
      </SfDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconLanguage, SfIconExpandMore, SfDropdown, useDisclosure } from '@storefront-ui/vue';
import { useI18n } from 'vue-i18n';

const { localeCodes, locale: currentLocale, t } = useI18n();
const { isEditing, disableActions } = useEditor();

const { isOpen, toggle } = useDisclosure();
</script>
