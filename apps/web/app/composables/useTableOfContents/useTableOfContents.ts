import type { Block } from '@plentymarkets/shop-api';
import type { FlatBlock, TocSectionId, TocSection } from '~/components/TableOfContents/types';

export const useTableOfContents = () => {
  const { setIndex } = useCarousel();
  const route = useRoute();
  const { isStructureBlock } = useBlockManager();
  const { logToCCreateBlock } = useLogEvent();
  const selectedUuid = useState<string>('toc-selected-uuid', () => '');
  const expandedBlocks = useState<Set<string>>('toc-expanded-blocks', () => new Set<string>());
  const hoveredUuid = useState<string>('toc-hovered-uuid', () => '');
  const highlightedUuid = useState<string>('toc-highlighted-uuid', () => '');
  const highlightTimeoutToken = useState<number>('toc-highlight-token', () => 0);
  const filters = useState<Set<TocSectionId>>('toc-filters', () => new Set<TocSectionId>());

  const { allBlocks: data } = useBlocks();

  watch(
    () => route.fullPath,
    () => {
      expandedBlocks.value.clear();
      selectedUuid.value = '';
      hoveredUuid.value = '';
      highlightedUuid.value = '';
      highlightTimeoutToken.value++;
      filters.value = new Set();
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
    }

    highlightedUuid.value = uuid;
    const token = ++highlightTimeoutToken.value;
    setTimeout(() => {
      if (highlightTimeoutToken.value === token) {
        highlightedUuid.value = '';
      }
    }, 1500);
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

  const replaceEmptyBlock = (event: MouseEvent | KeyboardEvent, block: Block) => {
    const anchorEl = event.currentTarget as HTMLElement;
    if (useRuntimeConfig().public.enableAddBlockPopover) {
      const { openAddBlockPopover } = useAddBlockPopover();
      openAddBlockPopover({ anchorEl, targetUuid: block.meta.uuid, position: 'inside' });
    } else {
      const { openDrawerWithView } = useSiteConfiguration();
      const { setInsertColumnUuid } = useBlocksMutations();
      setInsertColumnUuid(block.meta.uuid);
      openDrawerWithView('blocksList');
    }
  };

  const addBlockAtBottom = (event: MouseEvent) => {
    const { scrollIntoBlockView } = useBlockManager();

    const blocks = data.value;
    if (!blocks.length) return;

    const footerIndex = blocks.findIndex((block: Block) => isFooterContainerBlock(block));
    const footerBlock = footerIndex >= 0 ? blocks[footerIndex] : null;

    if (footerBlock) {
      if (useRuntimeConfig().public.enableAddBlockPopover) {
        const { openAddBlockPopover } = useAddBlockPopover();
        openAddBlockPopover({
          anchorEl: event.currentTarget as HTMLElement,
          targetUuid: footerBlock.meta.uuid,
          position: 'top',
        });
      } else {
        const { openDrawerWithView } = useSiteConfiguration();
        const { togglePlaceholder } = useBlockManager();
        const { clearInsertColumnUuid } = useBlocksMutations();
        togglePlaceholder(footerBlock.meta.uuid, 'top');
        openDrawerWithView('blocksList');
        clearInsertColumnUuid();
      }
      scrollIntoBlockView(footerBlock);
    }
  };

  const addBlockAtContainerEnd = (event: MouseEvent, container: Block | undefined | null) => {
    if (!container) {
      return;
    }

    const { scrollIntoBlockView } = useBlockManager();

    const children = (container.content ?? []) as Block[];
    const lastChild = children[children.length - 1];
    const anchorEl = event.currentTarget as HTMLElement;
    const targetUuid = lastChild?.meta?.uuid ?? container.meta.uuid;
    const position = lastChild ? 'bottom' : 'top';

    if (useRuntimeConfig().public.enableAddBlockPopover) {
      const { openAddBlockPopover } = useAddBlockPopover();
      openAddBlockPopover({ anchorEl, targetUuid, position });
    } else {
      const { openDrawerWithView } = useSiteConfiguration();
      const { togglePlaceholder } = useBlockManager();
      const { clearInsertColumnUuid } = useBlocksMutations();
      togglePlaceholder(targetUuid, position);
      openDrawerWithView('blocksList');
      clearInsertColumnUuid();
    }
    scrollIntoBlockView(lastChild ?? container);
  };

  const addBlockAtContainerStart = (event: MouseEvent, anchor: Block | undefined | null) => {
    if (!anchor) {
      return;
    }

    const { scrollIntoBlockView } = useBlockManager();
    const anchorEl = event.currentTarget as HTMLElement;

    if (useRuntimeConfig().public.enableAddBlockPopover) {
      const { openAddBlockPopover } = useAddBlockPopover();
      openAddBlockPopover({ anchorEl, targetUuid: anchor.meta.uuid, position: 'top' });
    } else {
      const { openDrawerWithView } = useSiteConfiguration();
      const { togglePlaceholder } = useBlockManager();
      const { clearInsertColumnUuid } = useBlocksMutations();
      togglePlaceholder(anchor.meta.uuid, 'top');
      openDrawerWithView('blocksList');
      clearInsertColumnUuid();
    }
    scrollIntoBlockView(anchor);
  };

  const addAtTopForSection = (event: MouseEvent, section: TocSection) => {
    if (section.id === 'content') {
      const first = section.elements[0];

      first ? addBlockAtContainerStart(event, first) : addBlockAtBottom(event);
    } else if (section.container) {
      addBlockAtContainerStart(event, section.elements[0] ?? section.container);
    }
    logToCCreateBlock();
  };

  const addAtBottomForSection = (event: MouseEvent, section: TocSection) => {
    if (section.id === 'content') {
      addBlockAtBottom(event);
    } else if (section.container) {
      addBlockAtContainerEnd(event, section.container);
    }
    logToCCreateBlock();
  };

  const handleSectionDragChange = (section: TocSection, evt: { moved?: { oldIndex: number; newIndex: number } }) => {
    if (!evt.moved || evt.moved.oldIndex === evt.moved.newIndex) {
      return;
    }

    const { scrollIntoBlockView } = useBlockManager();
    const draggedBlock = section.elements[evt.moved.newIndex];

    if (draggedBlock) {
      scrollIntoBlockView(draggedBlock);
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
    highlightedUuid,
    expandedBlocks,
    filters,
    data,
    flatBlocks,
    isStructureBlock,
    toggleBlockExpansion,
    getChildren,
    scrollToBlock,
    editBlock,
    replaceEmptyBlock,
    addBlockAtBottom,
    addBlockAtContainerEnd,
    addBlockAtContainerStart,
    addAtTopForSection,
    addAtBottomForSection,
    handleSectionDragChange,
    blockToFlatBlock,
    setHoveredBlock,
    clearHoveredBlock,
  };
};
