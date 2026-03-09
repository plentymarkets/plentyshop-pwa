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
        :class="{ '[&>svg]:brightness-0 [&>svg]:invert': isSelected, 'group-hover:[&>svg]:brightness-100 group-hover:[&>svg]:invert-0': isSelected }"
        v-html="getBlockIconSvg(blockName)"
      />
      <NuxtImg
        v-else
        :src="defaultBlockIcon"
        class="shrink-0 w-5 h-5 transition-all"
        :class="{ 'brightness-0 invert group-hover:brightness-100 group-hover:invert-0': isSelected }"
      />

      <span class="truncate text-sm">{{ label }}</span>
    </div>

    <div class="flex items-center gap-1 shrink-0">
      <button
        class="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        :data-testid="`toc-delete-${uuid}`"
        @click.stop
      >
        <SfIconDelete class="!w-5 !h-5" />
      </button>
      <button
        class="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        :data-testid="`toc-visibility-${uuid}`"
        @click.stop
      >
        <SfIconVisibility class="!w-4 !h-4 text-neutral-600" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconDelete, SfIconVisibility } from '@storefront-ui/vue';
import { getBlockIconSvg } from '~/utils/block-icons';
import defaultBlockIcon from '~/assets/icons/paths/block-default-icon.svg';

interface Props {
  uuid: string;
  blockName: string;
  label: string;
  isSelected: boolean;
}

defineProps<Props>();
</script>
