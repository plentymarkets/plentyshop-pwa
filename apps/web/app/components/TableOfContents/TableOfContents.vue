<template>
  <div class="pages-view sticky top-[52px] z-[2]" data-testid="blocks-overview-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">
        {{ getEditorTranslation('label') }}
      </div>
      <div class="flex items-center gap-2">
        <button data-testid="blocks-overview-close" class="!p-0" @click="closeDrawer">
          <SfIconClose />
        </button>
      </div>
    </header>

    <div class="h-[80vh] overflow-y-auto">
      <p class="mx-4 mt-4 mb-2 text-sm text-neutral-500">
        {{ getEditorTranslation('description') }}
      </p>

      <ul v-if="flatBlocks.length" class="mt-2 mb-4">
        <template v-for="(item, index) in flatBlocks" :key="item.uuid">
          <li
            role="button"
            tabindex="0"
            class="flex items-center justify-between py-1 px-3 cursor-pointer transition-colors hover:bg-[#E6F0FF] gap-2 group"
            :class="{ 'bg-[#E6F0FF]': selectedUuid === item.uuid }"
            :style="{ paddingLeft: `${16 + item.depth * 16}px` }"
            :data-testid="`blocks-overview-item-${index}`"
            @click="editBlock(item.block)"
            @keydown.enter="editBlock(item.block)"
            @keydown.space.prevent="editBlock(item.block)"
          >
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <button
                v-if="isStructureBlock(item.block)"
                class="shrink-0 w-4 h-4 flex items-center justify-center"
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
              <div v-else class="shrink-0 w-4" />

              <span
                v-if="getBlockIconSvg(item.block.name)"
                class="shrink-0 w-5 h-5 [&>svg]:w-full [&>svg]:h-full"
                v-html="getBlockIconSvg(item.block.name)"
              />

              <span class="truncate text-sm">{{ item.label }}</span>
            </div>

            <button
              class="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              :data-testid="`blocks-overview-delete-${index}`"
              @click.stop
            >
              <SfIconBase size="xs" viewBox="0 0 24 24" class="fill-red-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"
                    fill="currentColor"
                  />
                </svg>
              </SfIconBase>
            </button>
          </li>

          <template v-if="expandedBlocks.has(item.uuid) || !isStructureBlock(item.block)">
            <li
              v-for="child in getChildren(item)"
              :key="child.uuid"
              role="button"
              tabindex="0"
              class="flex items-center justify-between py-1 px-3 cursor-pointer transition-colors hover:bg-[#E6F0FF] gap-2 group"
              :class="{ 'bg-[#E6F0FF]': selectedUuid === child.uuid }"
              :style="{ paddingLeft: `${16 + child.depth * 16}px` }"
              :data-testid="`blocks-overview-item-${child.uuid}`"
              @click="editBlock(child.block)"
              @keydown.enter="editBlock(child.block)"
              @keydown.space.prevent="editBlock(child.block)"
            >
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <button
                  v-if="isStructureBlock(child.block)"
                  class="shrink-0 w-4 h-4 flex items-center justify-center"
                  @click.stop="toggleBlockExpansion(child.uuid)"
                >
                  <svg
                    class="w-3 h-3 transition-transform"
                    :class="{ 'rotate-90': expandedBlocks.has(child.uuid) }"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <div v-else class="shrink-0 w-4" />

                <span
                  v-if="getBlockIconSvg(child.block.name)"
                  class="shrink-0 w-5 h-5 [&>svg]:w-full [&>svg]:h-full"
                  v-html="getBlockIconSvg(child.block.name)"
                />
                <span class="truncate text-sm">{{ child.label }}</span>
              </div>

              <button
                class="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                :data-testid="`blocks-overview-delete-${child.uuid}`"
                @click.stop
              >
                <SfIconBase size="xs" viewBox="0 0 24 24" class="fill-red-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"
                      fill="currentColor"
                    />
                  </svg>
                </SfIconBase>
              </button>
            </li>
          </template>
        </template>
      </ul>

      <div v-else class="mx-4 mt-8 text-center text-sm text-neutral-400">
        {{ getEditorTranslation('empty') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconBase } from '@storefront-ui/vue';
import { getBlockIconSvg } from '~/utils/block-icons';
import type { Block } from '@plentymarkets/shop-api';

const { closeDrawer, openDrawerWithView } = useSiteConfiguration();
const route = useRoute();
const { setIndex } = useCarousel();
const { $i18n } = useNuxtApp();

interface FlatBlock {
  uuid: string;
  label: string;
  depth: number;
  block: Block;
}

const flattenBlocks = (blocks: Block[], depth = 0): FlatBlock[] => {
  const result: FlatBlock[] = [];
  for (const block of blocks) {
    if (!block.meta?.uuid) continue;
    result.push({
      uuid: block.meta.uuid,
      label: formatBlockName(block.name),
      depth,
      block,
    });
  }
  return result;
};

const formatBlockName = (name: string): string => {
  if (!name) return 'Unknown Block';
  return name.replace(/([A-Z])/g, ' $1').trim();
};

const selectedUuid = ref('');
const expandedBlocks = ref(new Set<string>());

const data = computed(() => {
  const identifier = route?.meta?.identifier as string;
  const type = route.meta.type as string;
  const locale = $i18n.locale.value;

  if (identifier === undefined || !type) return [];

  const { data: blockData } = useBlockTemplates(identifier, type, locale);

  return blockData.value ?? [];
});

watch(
  () => route.fullPath,
  () => {
    expandedBlocks.value.clear();
    selectedUuid.value = '';
  },
);

const flatBlocks = computed(() => (data.value.length ? flattenBlocks(data.value) : []));

const isStructureBlock = (block: Block): boolean => {
  return block.type === 'structure' && Array.isArray(block.content) && block.content.length > 0;
};

const toggleBlockExpansion = (uuid: string) => {
  if (expandedBlocks.value.has(uuid)) {
    expandedBlocks.value.delete(uuid);
  } else {
    expandedBlocks.value.add(uuid);
  }
};

const getChildren = (item: FlatBlock): FlatBlock[] => {
  const children: FlatBlock[] = [];
  if (Array.isArray(item.block.content)) {
    for (const child of item.block.content as Block[]) {
      if (child.meta?.uuid) {
        children.push({
          uuid: child.meta.uuid,
          label: formatBlockName(child.name),
          depth: item.depth + 1,
          block: child,
        });
      }
    }
  }
  return children;
};

const scrollToBlock = (uuid: string) => {
  selectedUuid.value = uuid;
  const el = document.querySelector(`[data-uuid="${uuid}"]`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    el.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2');
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2');
    }, 1500);
  }
};

const editBlock = (block: Block) => {
  scrollToBlock(block.meta.uuid);

  if (data.value) {
    for (const parentBlock of data.value) {
      if (parentBlock.name === 'Carousel' && Array.isArray(parentBlock.content)) {
        const slideIndex = (parentBlock.content as Block[]).findIndex((slide) => slide.meta?.uuid === block.meta.uuid);
        if (slideIndex !== -1) {
          setIndex(parentBlock.meta.uuid, slideIndex);
          break;
        }
      }
    }
  }

  openDrawerWithView('blocksSettings', block);
};
</script>

<i18n lang="json">
{
  "en": {
    "label": "Table of Contents",
    "description": "Click on a block to scroll to its position on the page.",
    "empty": "No blocks found on this page."
  },
  "de": {
    "label": "Table of Contents",
    "description": "Click on a block to scroll to its position on the page.",
    "empty": "No blocks found on this page."
  }
}
</i18n>
