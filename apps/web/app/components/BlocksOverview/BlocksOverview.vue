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
        <li
          v-for="(item, index) in flatBlocks"
          :key="item.uuid"
          class="flex items-center justify-between py-2 px-3 cursor-pointer transition-colors hover:bg-[#E6F0FF]"
          :class="{ 'bg-[#E6F0FF]': selectedUuid === item.uuid }"
          :style="{ paddingLeft: `${16 + item.depth * 16}px` }"
          :data-testid="`blocks-overview-item-${index}`"
          @click="scrollToBlock(item.uuid)"
        >
          <span class="truncate text-sm">{{ item.label }}</span>
          <button
            class="shrink-0 p-1 rounded hover:bg-[#d0e2ff]"
            :data-testid="`blocks-overview-edit-${index}`"
            @click.stop="editBlock(item.block)"
          >
            <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :d="editPath" fill="black" />
              </svg>
            </SfIconBase>
          </button>
        </li>
      </ul>

      <div v-else class="mx-4 mt-8 text-center text-sm text-neutral-400">
        {{ getEditorTranslation('empty') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconBase } from '@storefront-ui/vue';
import { editPath } from '~/assets/icons/paths/edit';
import type { Block } from '@plentymarkets/shop-api';

const { closeDrawer, openDrawerWithView } = useSiteConfiguration();
const route = useRoute();
const { data } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);

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
    if (Array.isArray(block.content) && block.content.length) {
      result.push(...flattenBlocks(block.content as Block[], depth + 1));
    }
  }
  return result;
};

const formatBlockName = (name: string): string => {
  if (!name) return 'Unknown Block';
  return name.replace(/([A-Z])/g, ' $1').trim();
};

const flatBlocks = computed(() => (data.value ? flattenBlocks(data.value) : []));

const selectedUuid = ref('');

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

