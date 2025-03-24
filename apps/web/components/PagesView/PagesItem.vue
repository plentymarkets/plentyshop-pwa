<template>
  <li class="border-b">
    <div
      :class="['px-4 py-2 flex items-center justify-between cursor-pointer', isActive ? 'bg-gray-200' : '']"
      @click="toggle"
    >
      <span v-if="item.children && item.children.length > 0">
        <SfIconExpandMore />
      </span>
      <span>
        {{ item.id }}
      </span>
      <router-link
        :to="`${localePrefix}${item.path}`"
        class="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis"
      >
        <span v-if="item.name === 'Homepage'">
          <SfIconHome class="w-4 h-4 mr-2" />
        </span>
        {{ item.name }}
      </router-link>
    </div>
    <ul v-if="item.children && open" class="pl-4 border-l border-gray-200">
      <PagesItem v-for="child in item.children" :key="child.path" :item="child" />
    </ul>
  </li>
</template>
<script setup lang="ts">
import type { MenuItemType } from '~/components/PagesView/types';
import { SfIconHome, SfIconExpandMore } from '@storefront-ui/vue';

const { locale } = useI18n();
const localePrefix = computed(() => (locale.value.startsWith('/') ? locale.value : `/${locale.value}`));

const { item } = defineProps<{
  item: MenuItemType;
}>();

const open = ref(false);
const toggle = () => (open.value = !open.value);
const route = useRoute();
const isActive = computed(() => route.path === item.path);
</script>
