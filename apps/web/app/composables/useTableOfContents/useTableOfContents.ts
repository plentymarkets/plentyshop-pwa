import type { Block } from '@plentymarkets/shop-api';
import type { FlatBlock } from '~/components/TableOfContents/types';

export const useTableOfContents = () => {
  const { setIndex } = useCarousel();
  const route = useRoute();
  const { $i18n } = useNuxtApp();
  const { isStructureBlock } = useBlockManager();
  const selectedUuid = useState<string>('toc-selected-uuid', () => '');
  const expandedBlocks = useState<Set<string>>('toc-expanded-blocks', () => new Set<string>());
  const hoveredUuid = useState<string>('toc-hovered-uuid', () => '');

  const { data } = useBlockTemplates(route?.meta?.identifier as string, route.meta.type as string, $i18n.locale.value);

  watch(
    () => route.fullPath,
    () => {
      expandedBlocks.value.clear();
      selectedUuid.value = '';
      hoveredUuid.value = '';
    },
  );

  const flattenBlocks = (blocks: Block[], depth = 0): FlatBlock[] => {
    const result: FlatBlock[] = [];
    for (const block of blocks) {
      if (!block.meta?.uuid) continue;
      result.push({
        uuid: block.meta.uuid,
        label: getBlockDisplayName(block.name),
        depth,
        block,
      });
    }
    return result;
  };

  const blockToFlatBlock = (block: Block, depth = 0): FlatBlock => ({
    uuid: block.meta.uuid,
    label: getBlockDisplayName(block.name),
    depth,
    block,
  });

  const flatBlocks = computed(() => (data.value.length ? flattenBlocks(data.value) : []));

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
            label: getBlockDisplayName(child.name),
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

      el.classList.add('outline', 'outline-4', 'outline-editor-toc-selected');
      setTimeout(() => {
        el.classList.remove('outline', 'outline-4', 'outline-editor-toc-selected');
      }, 1500);
    }
  };

  const editBlock = (block: Block) => {
    const { openDrawerWithView } = useSiteConfiguration();

    scrollToBlock(block.meta.uuid);

    if (data.value) {
      for (const parentBlock of data.value) {
        if (parentBlock.name === 'Carousel' && Array.isArray(parentBlock.content)) {
          const slideIndex = (parentBlock.content as Block[]).findIndex(
            (slide) => slide.meta?.uuid === block.meta.uuid,
          );
          if (slideIndex !== -1) {
            setIndex(parentBlock.meta.uuid, slideIndex);
            break;
          }
        }
      }
    }

    openDrawerWithView('blocksSettings', block);
  };

  const addBlockAtBottom = () => {
    const { togglePlaceholder, multigridColumnUuid, scrollIntoBlockView } = useBlockManager();
    const { openDrawerWithView } = useSiteConfiguration();

    const blocks = data.value;
    if (!blocks.length) return;

    const footerIndex = blocks.findIndex((block: Block) => isFooterBlock(block));
    const footerBlock = footerIndex >= 0 ? blocks[footerIndex] : null;

    if (footerBlock) {
      togglePlaceholder(footerBlock.meta.uuid, 'top');
      openDrawerWithView('blocksList');
      multigridColumnUuid.value = null;
      scrollIntoBlockView(footerBlock);
    }
  };

  const setHoveredBlock = (uuid: string) => {
    hoveredUuid.value = uuid;
  };

  const clearHoveredBlock = () => {
    hoveredUuid.value = '';
  };

  return {
    selectedUuid,
    hoveredUuid,
    expandedBlocks,
    data,
    flatBlocks,
    isStructureBlock,
    toggleBlockExpansion,
    getChildren,
    scrollToBlock,
    editBlock,
    addBlockAtBottom,
    blockToFlatBlock,
    setHoveredBlock,
    clearHoveredBlock,
  };
};
