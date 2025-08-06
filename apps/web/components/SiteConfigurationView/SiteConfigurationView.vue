<template>
  <div class="site-settings-view sticky top-[52px] relative overflow-hidden" data-testid="site-settings-drawer">
    <div v-if="!activeSubCategory" key="sub-list" class="sub-categories">
      <header class="border-b">
        <div class="flex items-center justify-between px-4 py-5">
          <div class="flex items-center text-xl font-bold">
            <slot name="setting-title" />
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
          @click="activeSubCategory = subCategory"
        >
          <span class="break-words">
            {{ t(`${subCategory}`) }}
          </span>
          <template #suffix><SfIconChevronRight /></template>
        </SfListItem>
      </div>
    </div>
    <div v-else key="groups" class="groups">
      <header class="flex items-center justify-between px-4 py-5 border-b">
        <div class="flex items-center text-xl font-bold">
          <slot name="setting-title" />
        </div>
        <button data-testid="view-close" class="!p-0" @click="activeSubCategory = ''">
          <SfIconChevronLeft />
        </button>
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
const { t } = useI18n();

const { closeDrawer, activeSetting, activeSubCategory } = useSiteConfiguration();

const groups = computed(() => getSettingsGroups(activeSetting.value, activeSubCategory.value));
const subCategories = computed(() => getSubCategories(activeSetting.value));
</script>
