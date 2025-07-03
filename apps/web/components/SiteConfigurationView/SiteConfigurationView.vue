<template>
  <div class="site-settings-view sticky top-[52px]" data-testid="site-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        <slot name="setting-group-title" />
      </div>
      <button data-testid="view-close" class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>

    <div class="h-[calc(100vh-150px)] overflow-y-auto">
      <SettingsGroup v-for="group in groups" :key="group.title" :data-testid="`${group.slug}-section`">
        <template #settings-group-title>{{ group.title }}</template>

        <component :is="component" v-for="(component, index) in group.components" :key="index" />
      </SettingsGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';

const { closeDrawer, activeSetting } = useSiteConfiguration();

const groups = computed(() => getSettingsGroups(activeSetting.value));
</script>
