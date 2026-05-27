<template>
  <transition
    enter-active-class="transition duration-500 ease-in-out"
    leave-active-class="transition duration-500 ease-in-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <SfDrawer
      v-show="isOpen"
      :model-value="true"
      :disable-click-away="true"
      :disable-esc="true"
      class="w-full rounded shadow-none lg:translate-x-0 z-[100] lg:z-0 lg:static lg:!block max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:max-w-sm -translate-x-full shrink-0 bg-white overflow-y-auto"
      data-testid="category-sidebar"
    >
      <div class="grid grid-rows-category-sidebar lg:h-full lg:block">
        <div class="p-4 flex justify-between items-center lg:hidden">
          <span class="font-bold text-lg">{{ t('common.labels.listSettings') }}</span>
          <UiButton variant="tertiary" :aria-label="t('common.navigation.closeListSettings')" @click="$emit('close')">
            <template #prefix>
              <SfIconClose class="text-neutral-500" />
            </template>
          </UiButton>
        </div>
        <slot class="overflow-y-auto lg:overflow-y-visible py-4 lg:p-0" />
        <div class="p-4 lg:mt-2 flex flex-wrap justify-between border-t border-t-neutral-200 lg:border-0 gap-3">
          <UiButton class="lg:hidden whitespace-nowrap flex flex-1" variant="primary" @click="$emit('close')">
            {{ t('common.actions.showProducts') }}
          </UiButton>
        </div>
      </div>
    </SfDrawer>
  </transition>
</template>

<script setup lang="ts">
import { SfDrawer, SfIconClose } from '@storefront-ui/vue';
import type { CategorySidebarEmits, CategorySidebarProps } from '~/components/CategorySidebar/types';

defineProps<CategorySidebarProps>();
defineEmits<CategorySidebarEmits>();
</script>
