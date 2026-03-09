<template>
  <div
    class="flex items-center justify-between flex-1 px-2 py-1 rounded-md transition-colors hover:bg-editor-toc-highlight hover:text-black"
    :class="{ 'bg-editor-toc-selected text-white': isSelected }"
  >
    <div class="flex items-center gap-2 min-w-0 flex-1">
      <slot name="arrow">
        <div class="shrink-0 w-4" />
      </slot>

      <span
        v-if="getBlockIconSvg(blockName)"
        class="shrink-0 w-5 h-5 [&>svg]:w-full [&>svg]:h-full transition-all"
        :class="{
          '[&>svg]:brightness-0 [&>svg]:invert': isSelected,
          'group-hover:[&>svg]:brightness-100 group-hover:[&>svg]:invert-0': isSelected,
          'opacity-50': !isVisible
        }"
        v-html="getBlockIconSvg(blockName)"
      />
      <NuxtImg
        v-else
        :src="defaultBlockIcon"
        class="shrink-0 w-5 h-5 transition-all"
        :class="{
          'brightness-0 invert group-hover:brightness-100 group-hover:invert-0': isSelected,
          'opacity-50': !isVisible
        }"
      />

      <span
        class="truncate text-sm transition-opacity"
        :class="{ 'opacity-50': !isVisible }"
      >
        {{ label }}
      </span>
    </div>

    <div class="flex items-center gap-1 shrink-0">
      <button
        class="p-1 opacity-0 group-hover:opacity-100 rounded hover:bg-editor-icon-hover transition-colors"
        :data-testid="`toc-delete-${uuid}`"
        @click.stop
      >
        <SfIconDelete class="!w-5 !h-5" />
      </button>
      <button
        class="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-editor-icon-hover"
        :class="{ 'opacity-100': !isVisible }"
        :data-testid="`toc-visibility-${uuid}`"
        @click.stop="toggleVisibility"
      >
        <SfIconVisibility
          v-if="isVisible"
          class="!w-5 !h-5 text-neutral-600"
        />
        <SfIconVisibilityOff
          v-else
          class="!w-5 !h-5 text-neutral-600"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconDelete, SfIconVisibility, SfIconVisibilityOff } from '@storefront-ui/vue';
import { getBlockIconSvg } from '~/utils/block-icons';
import defaultBlockIcon from '~/assets/icons/paths/block-default-icon.svg';
import type { Block } from '@plentymarkets/shop-api';

interface Props {
  uuid: string;
  blockName: string;
  label: string;
  isSelected: boolean;
  block: Block;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update-visibility': [visible: boolean];
}>();

const isVisible = computed(() => (props.block.configuration as Record<string, unknown>)?.visible !== false);

const toggleVisibility = () => {
  const newVisibility = !isVisible.value;
  emit('update-visibility', newVisibility);
};
</script>
