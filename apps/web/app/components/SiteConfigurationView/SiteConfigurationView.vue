<template>
  <div class="site-settings-view sticky h-full max-h-screen flex flex-col pb-4" data-testid="site-settings-drawer">
    <div
      v-if="subCategories.length > 1 && !activeSubCategory"
      key="sub-list"
      class="sub-categories flex flex-col flex-1 min-h-0"
    >
      <header class="border-b flex-shrink-0">
        <div class="flex items-center justify-between px-4 py-5">
          <div class="flex items-center w-full">
            <div class="flex items-center">
              <slot name="setting-breadcrumbs" />
            </div>
            <div class="text-xl font-bold w-full">
              <slot name="setting-title" />
            </div>
          </div>
          <button data-testid="view-close" class="!p-0 flex-shrink-0" @click="closeSiteConfigurationDrawer">
            <SfIconClose />
          </button>
        </div>

        <slot name="setting-description" />
      </header>

      <div class="flex-1 min-h-0 overflow-y-auto" data-testid="site-settings-scroll-container">
        <button
          v-for="subCategory in subCategories"
          :key="subCategory"
          type="button"
          class="w-full flex items-center gap-1.5 px-3.5 py-2 bg-editor-surface border-b border-editor-border hover:bg-editor-toc-hover transition-colors cursor-pointer text-left select-none"
          :data-testid="`site-settings-category-${subCategory}`"
          @click="activeSubCategory = subCategory"
        >
          <span class="flex-1 text-2xs font-bold text-editor-text-subtle tracking-wider uppercase break-words">
            {{ getEditorUITranslation(subCategory) }}
          </span>
          <SfIconChevronRight size="xs" class="text-editor-text-placeholder flex-shrink-0" />
        </button>
      </div>
    </div>
    <div v-else key="groups" class="groups flex flex-col flex-1 min-h-0">
      <header class="border-b flex-shrink-0">
        <div class="flex items-center justify-between px-4 py-4">
          <div class="flex items-start flex-col">
            <div class="flex items-center text-sm cursor-pointer" @click="activeSubCategory = ''">
              <slot name="setting-breadcrumbs">
                {{ getEditorUITranslation(activeSetting) }}
              </slot>
            </div>
            <div class="text-xl font-bold">
              <slot name="setting-title" />
            </div>
          </div>
          <button
            v-if="subCategories.length === 1"
            data-testid="view-close"
            class="!p-0"
            @click="closeSiteConfigurationDrawer"
          >
            <SfIconClose />
          </button>
          <button v-else data-testid="view-back" class="!p-0" @click="activeSubCategory = ''">
            <SfIconChevronLeft />
          </button>
        </div>

        <slot name="setting-description" />
      </header>

      <div class="flex-1 min-h-0 overflow-y-auto" data-testid="site-settings-scroll-container">
        <SettingsGroup v-for="group in groups" :key="group.title" :data-testid="`${group.slug}-section`">
          <template #settings-group-title>{{ group.title }}</template>

          <component :is="component" v-for="(component, index) in group.components" :key="index" />
        </SettingsGroup>
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { SfIconChevronRight, SfIconChevronLeft, SfIconClose } from '@storefront-ui/vue';

const { closeSiteConfigurationDrawer, activeSetting, activeSubCategory, setActiveSubCategory } = useSiteConfiguration();
const runtimeConfig = useRuntimeConfig();

const subCategories = computed(() => {
  const categories = getSubCategories(activeSetting.value);
  const excludedSubCategories = runtimeConfig.public.disabledEditorSettings as string[];

  return categories.filter((subCategory) => !excludedSubCategories.includes(subCategory));
});

setActiveSubCategory(
  subCategories.value.length === 1 ? (subCategories.value[0] ?? '') : (activeSubCategory.value ?? ''),
);

const groups = computed(() => {
  const allGroups = getSettingsGroups(activeSetting.value ?? '', activeSubCategory.value ?? '');
  const excludedGroups = runtimeConfig.public.disabledEditorSettings as string[];

  return allGroups.filter((group) => !excludedGroups.includes(group.slug));
});
</script>
