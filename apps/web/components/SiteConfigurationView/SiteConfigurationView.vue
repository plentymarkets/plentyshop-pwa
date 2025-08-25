<template>
  <div class="site-settings-view sticky top-[52px] relative overflow-hidden" data-testid="site-settings-drawer">
    <div v-if="subCategories.length > 1 && !activeSubCategory" key="sub-list" class="sub-categories">
      <header class="border-b">
        <div class="flex items-center justify-between px-4 py-5">
          <div class="flex items-center">
            <div class="flex items-center">
              <slot name="setting-breadcrumbs" />
            </div>
            <div class="text-xl font-bold">
              <slot name="setting-title" />
            </div>
          </div>
          <button data-testid="view-close" class="!p-0" @click="closeDrawer">
            <SfIconClose />
          </button>
        </div>

        <slot name="setting-description" />
      </header>

      <div class="h-[calc(100vh-150px)] overflow-y-auto">
        <SfListItem
          v-for="subCategory in subCategories"
          :key="subCategory"
          class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
          :data-testid="`site-settings-sub-category-${subCategory}`"
          @click="activeSubCategory = subCategory"
        >
          <span class="break-words">
            {{ t(`${noPrefix(subCategory)}`) }}
          </span>
          <template #suffix><SfIconChevronRight /></template>
        </SfListItem>
      </div>
    </div>
    <div v-else key="groups" class="groups">
      <header class="border-b">
        <div class="flex items-center justify-between px-4 py-4">
          <div class="flex items-start flex-col">
            <div class="flex items-center text-sm cursor-pointer" @click="activeSubCategory = ''">
              <slot name="setting-breadcrumbs">
                {{ t(`${activeSettingNoPrefix}`) }}
              </slot>
            </div>
            <div class="text-xl font-bold">
              <slot name="setting-title" />
            </div>
          </div>
          <button v-if="subCategories.length === 1" data-testid="view-close" class="!p-0" @click="closeDrawer">
            <SfIconClose />
          </button>
          <button v-else data-testid="view-back" class="!p-0" @click="activeSubCategory = ''">
            <SfIconChevronLeft />
          </button>
        </div>

        <slot name="setting-description" />
      </header>

      <div class="h-[calc(100vh-150px)] overflow-y-auto">
        <SettingsGroup v-for="group in groups" :key="group.title" :data-testid="`${group.slug}-section`">
          <template #settings-group-title>{{ group.title }}</template>

          <component :is="component" v-for="(component, index) in group.components" :key="index" />
        </SettingsGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfListItem, SfIconChevronRight, SfIconChevronLeft, SfIconClose } from '@storefront-ui/vue';
import { getSubCategories } from '~/utils/settings-groups-imports';
import type { Messages } from '~/components/SiteConfigurationView/types';
import { getSettingsTranslations } from '~/utils/settings-translations-imports';
const { t } = useI18n();

const { closeDrawer, activeSetting, activeSubCategory, setActiveSubCategory } = useSiteConfiguration();

const subCategories = computed(() => getSubCategories(activeSetting.value));
const activeSettingNoPrefix = computed(() => activeSetting.value.replace(/^\d+-/, ''));
const noPrefix = (category: string) => { return category.replace(/^\d+-/, '') };

setActiveSubCategory(subCategories.value.length === 1 ? subCategories.value[0] : activeSubCategory.value);

const groups = computed(() => getSettingsGroups(activeSetting.value, activeSubCategory.value));

const messages: Messages = {};

const { $registerMessages } = useNuxtApp();
Object.values(getSettingsTranslations()).forEach((fileContent) => {
  Object.entries(fileContent).forEach(([locale, translations]) => {
    if (!messages[locale as keyof typeof messages]) {
      messages[locale as keyof typeof messages] = {};
    }
    Object.assign(messages[locale as keyof typeof messages], translations);
  });
});

$registerMessages(messages);
</script>
