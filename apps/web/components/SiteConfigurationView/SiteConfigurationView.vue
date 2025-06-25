<template>
  <div class="site-settings-view sticky top-[52px]" data-testid="site-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        <slot name="setting-group-title" />
      </div>
      <button data-testid="design-view-close" class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>

    <div class="h-[calc(100vh-150px)] overflow-y-auto">
      <SettingsGroup v-for="group in groups" :key="group.title" :data-testid="`${group.title}-section`">
        <template #settings-group-title>{{ group.title }}</template>

        <component :is="component" v-for="(component, index) in group.components" :key="index" />
      </SettingsGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { SfIconClose } from '@storefront-ui/vue';

const { closeDrawer, activeSetting } = useSiteConfiguration();

const modules = import.meta.glob('@/components/**/settings/**/*.vue') as Record<
  string,
  () => Promise<{ default: unknown }>
>;

const formatTitle = (folderName: string): string => {
  return folderName
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
};

const stripPrefix = (raw: string): string => raw.replace(/^(\d+)\./, '');

const groups = computed(() => {
  const prefix = `/settings/${activeSetting.value}/`;
  const map: Record<string, { title: string; components: unknown[] }> = {};

  for (const [path, loader] of Object.entries(modules)) {
    if (!path.includes(prefix)) continue;

    const afterPrefix = path.split(prefix)[1];
    if (!afterPrefix) continue;

    const segments = afterPrefix.split('/');
    if (segments.length < 2) continue;

    const groupSlug = stripPrefix(segments[0]);

    if (!map[groupSlug]) {
      map[groupSlug] = {
        title: formatTitle(groupSlug),
        components: [],
      };
    }

    map[groupSlug].components.push(defineAsyncComponent(loader));
  }

  return Object.values(map);
});
</script>
