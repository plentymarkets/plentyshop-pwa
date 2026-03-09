<template>
  <li
    role="button"
    tabindex="0"
    class="flex items-center justify-between py-1 my-1 cursor-pointer transition-colors gap-2 group"
    :style="{ paddingLeft: `${item.depth * 16}px` }"
    :data-testid="testId"
    @click="onItemClick"
    @keydown.enter="onItemClick"
    @keydown.space.prevent="onItemClick"
  >
    <template v-if="item.depth === 0">
      <div
        class="flex items-center justify-between flex-1 px-2 py-1 rounded-md transition-colors hover:bg-editor-toc-highlight hover:text-black"
        :class="{ 'bg-editor-toc-selected text-white': isItemSelected }"
      >
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <template v-if="isStructureBlock(item.block)">
            <button
              class="shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-editor-icon-hover transition-colors p-0.5 -ml-0.5"
              @click.stop="toggleBlockExpansion(item.uuid)"
            >
              <svg
                class="w-3 h-3 transition-transform"
                :class="{ 'rotate-90': expandedBlocks.has(item.uuid) }"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </template>
          <template v-else>
            <div class="shrink-0 w-4" />
          </template>

          <span
            v-if="getBlockIconSvg(item.block.name)"
            class="shrink-0 w-5 h-5 [&>svg]:w-full [&>svg]:h-full transition-all"
            :class="{ '[&>svg]:brightness-0 [&>svg]:invert': isItemSelected, 'group-hover:[&>svg]:brightness-100 group-hover:[&>svg]:invert-0': isItemSelected }"
            v-html="getBlockIconSvg(item.block.name)"
          />
          <NuxtImg v-else :src="defaultBlockIcon" class="shrink-0 w-5 h-5 transition-all" :class="{ 'brightness-0 invert group-hover:brightness-100 group-hover:invert-0': isItemSelected }" />

          <span class="truncate text-sm">{{ item.label }}</span>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button
            class="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            :data-testid="deleteTestId"
            @click.stop
          >
            <SfIconDelete class="!w-5 !h-5" />
          </button>
          <button
            class="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            :data-testid="`blocks-overview-visibility-${testId}`"
            @click.stop
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-neutral-600">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <template v-if="isStructureBlock(item.block)">
        <div
          class="flex items-center justify-between flex-1 px-2 py-1 rounded-md transition-colors hover:bg-editor-toc-highlight hover:text-black"
          :class="{ 'bg-editor-toc-selected text-white': isItemSelected }"
        >
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <button
              class="shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-editor-icon-hover transition-colors p-0.5 -ml-0.5"
              @click.stop="toggleBlockExpansion(item.uuid)"
            >
              <svg
                class="w-3 h-3 transition-transform"
                :class="{ 'rotate-90': expandedBlocks.has(item.uuid) }"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <span
              v-if="getBlockIconSvg(item.block.name)"
              class="shrink-0 w-5 h-5 [&>svg]:w-full [&>svg]:h-full transition-all"
              :class="{ '[&>svg]:brightness-0 [&>svg]:invert': isItemSelected, 'group-hover:[&>svg]:brightness-100 group-hover:[&>svg]:invert-0': isItemSelected }"
              v-html="getBlockIconSvg(item.block.name)"
            />
            <NuxtImg v-else :src="defaultBlockIcon" class="shrink-0 w-5 h-5 transition-all" :class="{ 'brightness-0 invert group-hover:brightness-100 group-hover:invert-0': isItemSelected }" />

            <span class="truncate text-sm">{{ item.label }}</span>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <button
              class="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              :data-testid="deleteTestId"
              @click.stop
            >
              <SfIconDelete class="!w-5 !h-5" />
            </button>
            <button
              class="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              :data-testid="`blocks-overview-visibility-${testId}`"
              @click.stop
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-neutral-600">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="shrink-0 w-4" />

        <div
          class="flex items-center justify-between flex-1 px-2 py-1 rounded-md transition-colors hover:bg-editor-toc-highlight hover:text-black"
          :class="{ 'bg-editor-toc-selected text-white': isItemSelected }"
        >
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <span
              v-if="getBlockIconSvg(item.block.name)"
              class="shrink-0 w-5 h-5 [&>svg]:w-full [&>svg]:h-full transition-all"
              :class="{ '[&>svg]:brightness-0 [&>svg]:invert': isItemSelected, 'group-hover:[&>svg]:brightness-100 group-hover:[&>svg]:invert-0': isItemSelected }"
              v-html="getBlockIconSvg(item.block.name)"
            />
            <NuxtImg v-else :src="defaultBlockIcon" class="shrink-0 w-5 h-5 transition-all" :class="{ 'brightness-0 invert group-hover:brightness-100 group-hover:invert-0': isItemSelected }" />

            <span class="truncate text-sm">{{ item.label }}</span>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <button
              class="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              :data-testid="deleteTestId"
              @click.stop
            >
              <SfIconDelete class="!w-5 !h-5" />
            </button>
            <button
              class="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              :data-testid="`blocks-overview-visibility-${testId}`"
              @click.stop
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-neutral-600">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </template>
    </template>
  </li>

  <template v-if="(expandedBlocks.has(item.uuid) || !isStructureBlock(item.block)) && getChildren(item).length">
    <TableOfContentsItem
      v-for="child in getChildren(item)"
      :key="child.uuid"
      :item="child"
      :test-id="`blocks-overview-item-${child.uuid}`"
      :delete-test-id="`blocks-overview-delete-${child.uuid}`"
    />
  </template>
</template>

<script setup lang="ts">
import { SfIconDelete } from '@storefront-ui/vue';
import { getBlockIconSvg } from '~/utils/block-icons';
import type { FlatBlock } from './types';
import { useTableOfContents } from '~/composables/useTableOfContents/useTableOfContents';
import defaultBlockIcon from '~/assets/icons/paths/block-default-icon.svg';

interface Props {
  item: FlatBlock;
  testId: string;
  deleteTestId: string;
}

const props = defineProps<Props>();

const { selectedUuid, expandedBlocks, isStructureBlock, toggleBlockExpansion, getChildren, editBlock } =
  useTableOfContents();

const isItemSelected = computed(() => selectedUuid.value === props.item.uuid);

const onItemClick = async () => {
  editBlock(props.item.block);
};
</script>
