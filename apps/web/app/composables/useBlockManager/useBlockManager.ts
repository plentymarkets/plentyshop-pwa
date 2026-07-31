/* eslint-disable max-lines -- pending refactor */
import type { Block } from '@plentymarkets/shop-api';
import type { BlockPosition, RefCallback, ShowBottomAddInGridOptions } from './types';
import { v4 as uuid } from 'uuid';
import type { LazyLoadConfig } from '~/components/PageBlock/types';
import { isHeaderContainerBlock } from '~/utils/blockTemplates/header/factory';
import { isFooterContainerBlock } from '~/utils/blockTemplates/footer/factory';

const visiblePlaceholder = ref<{ uuid: string; position: BlockPosition }>({
  uuid: '',
  position: 'top',
});
const togglePlaceholder = (uuid: string, position: BlockPosition) => {
  visiblePlaceholder.value = { uuid, position };
};

const dragState = reactive({
  isDragging: false,
});

const LAZY_LOAD_BLOCKS: Record<string, LazyLoadConfig> = {
  ProductRecommendedProducts: {
    propName: 'shouldLoad',
    rootMargin: '0px 0px 250px 0px',
    threshold: 0,
  },
};

export const useBlockManager = () => {
  const { $i18n } = useNuxtApp();

  const { data, cleanData, pageBlocks, allBlocks, headerContainer, footer, updateBlocks, cancelCleanDataSync } =
    useBlocks();

  const { isEditingEnabled } = useEditor();
  const { getBlockTemplateByLanguage } = useBlocksList();
  const { openDrawerWithView, closeBlocksConfigurationDrawer } = useSiteConfiguration();
  const { send } = useNotification();
  const { setPendingEditChain } = useBlockEditStack();

  const currentBlock = ref<Block | null>(null);
  const currentBlockUuid = ref<string | null>(null);
  const isClicked = ref(false);
  const clickedBlockIndex = ref<number | null>(null);
  const lazyLoadStates = ref<Record<string, boolean>>({});
  const lazyLoadRefs = ref<Record<string, HTMLElement | null>>({});
  const viewport = useViewport();
  const isTablet = computed(() => viewport.isLessThan('lg') && viewport.isGreaterThan('sm'));

  const insertBlock = ({
    targetBlock,
    newBlock,
    parent,
    index,
    position,
  }: {
    targetBlock: Block;
    newBlock: Block;
    parent: Block[];
    index: number;
    position: BlockPosition;
  }) => {
    if (position === 'inside') {
      insertIntoColumn(targetBlock, newBlock, parent);
    } else {
      insertNextToBlock(parent, index, newBlock, position);
    }
  };

  const addBlockToHeader = (newBlock: Block, targetUuid: string, position: BlockPosition) => {
    if (!headerContainer.value || !Array.isArray(headerContainer.value.content)) return;

    const headerContent = headerContainer.value.content as Block[];

    if (headerContainer.value.meta?.uuid === targetUuid) {
      if (Array.isArray(newBlock.content) && newBlock.content.length) {
        setUuid(newBlock.content as Block[]);
      }

      position === 'top' ? headerContent.unshift(newBlock) : headerContent.push(newBlock);
      return;
    }

    const parentInfo = findBlockParent(headerContent, targetUuid);
    if (!parentInfo) return;

    const { parent, index } = parentInfo;
    const targetBlock = parent[index];
    if (!targetBlock) return;

    newBlock.parent_slot = targetBlock.parent_slot;

    insertBlock({ targetBlock, newBlock, parent, index, position });

    if (Array.isArray(newBlock.content) && newBlock.content.length) {
      setUuid(newBlock.content as Block[]);
    }
  };

  const addBlockToFooter = (newBlock: Block, targetUuid: string, position: BlockPosition) => {
    if (!footer.value || !Array.isArray(footer.value.content)) return;

    const footerContent = footer.value.content as Block[];
    const parentInfo = findBlockParent(footerContent, targetUuid);
    if (!parentInfo) return;

    const { parent, index } = parentInfo;
    const targetBlock = parent[index];
    if (!targetBlock) return;

    newBlock.parent_slot = targetBlock.parent_slot;

    insertBlock({ targetBlock, newBlock, parent, index, position });

    if (Array.isArray(newBlock.content) && newBlock.content.length) {
      setUuid(newBlock.content as Block[]);
    }
  };

  const addBlockToPage = (newBlock: Block, targetUuid: string, position: BlockPosition): boolean => {
    if (!pageBlocks.value) return false;

    if (pageBlocks.value.length === 0) {
      if (Array.isArray(newBlock.content) && newBlock.content.length) {
        setUuid(newBlock.content as Block[]);
      }
      updateBlocks([newBlock]);
      openSettingsForNewBlock([newBlock], newBlock);
      return false;
    }

    const blocks = pageBlocks.value as Block[];
    const isTargetFooter = footer.value?.meta?.uuid === targetUuid;

    if (isTargetFooter) {
      if (Array.isArray(newBlock.content) && newBlock.content.length) {
        setUuid(newBlock.content as Block[]);
      }
      blocks.push(newBlock);
      openSettingsForNewBlock(blocks, newBlock);
      return true;
    }

    const parentInfo = findBlockParent(blocks, targetUuid);
    const parent = parentInfo?.parent ?? blocks;
    const index = parentInfo?.index ?? 0;
    const targetBlock = parent[index];
    if (!targetBlock) return false;

    newBlock.parent_slot = targetBlock.parent_slot;

    insertBlock({ targetBlock, newBlock, parent, index, position });

    if (Array.isArray(newBlock.content) && newBlock.content.length) {
      setUuid(newBlock.content as Block[]);
    }

    if (!isHeaderContainerBlock(getRootParent(blocks, newBlock.meta.uuid))) {
      openSettingsForNewBlock(blocks, newBlock);
    }

    return true;
  };

  const openSettingsForNewBlock = (rootBlocks: Block[], newBlock: Block) => {
    const chain = getAncestorChain(rootBlocks, newBlock.meta.uuid) ?? [newBlock];
    const rootBlock = chain[0] ?? newBlock;

    setPendingEditChain(chain.slice(1));
    openDrawerWithView('blocksSettings', rootBlock);
  };

  const addNewBlock = async (category: string, variationIndex: number, targetUuid: string, position: BlockPosition) => {
    if (!pageBlocks.value) return;
    cancelCleanDataSync();

    const newBlock = await getBlockTemplateByLanguage(category, variationIndex, $i18n.locale.value);
    newBlock.meta.uuid = uuid();

    const isTargetInHeader =
      !!headerContainer.value &&
      !!findBlockParent(Array.isArray(headerContainer.value.content) ? [headerContainer.value] : [], targetUuid);

    const isTargetInFooter =
      !!footer.value && Array.isArray(footer.value.content) && !!findBlockParent(footer.value.content, targetUuid);

    isEditingEnabled.value = true;

    if (isTargetInHeader) {
      addBlockToHeader(newBlock, targetUuid, position);
    } else if (isTargetInFooter) {
      addBlockToFooter(newBlock, targetUuid, position);
    } else if (!addBlockToPage(newBlock, targetUuid, position)) {
      return;
    }

    visiblePlaceholder.value = { uuid: '', position: 'top' };
    isEditingEnabled.value = !deepEqual(cleanData.value, data.value);

    scrollIntoBlockView(newBlock, false, 'bottom', 'auto');

    const selectedUuid = useState<string>('toc-selected-uuid');
    selectedUuid.value = newBlock.meta.uuid;
    openDrawerWithView('TableOfContents');
  };

  const insertCustomBlock = (newBlock: Block, targetUuid: string, position: BlockPosition) => {
    if (!pageBlocks.value) return;
    cancelCleanDataSync();

    newBlock.meta.uuid = uuid();

    const isTargetInHeader =
      !!headerContainer.value &&
      !!findBlockParent(Array.isArray(headerContainer.value.content) ? [headerContainer.value] : [], targetUuid);

    const isTargetInFooter =
      !!footer.value && Array.isArray(footer.value.content) && !!findBlockParent(footer.value.content, targetUuid);

    isEditingEnabled.value = true;

    if (isTargetInHeader) {
      addBlockToHeader(newBlock, targetUuid, position);
    } else if (isTargetInFooter) {
      addBlockToFooter(newBlock, targetUuid, position);
    } else if (!addBlockToPage(newBlock, targetUuid, position)) {
      return;
    }

    visiblePlaceholder.value = { uuid: '', position: 'top' };
    isEditingEnabled.value = !deepEqual(cleanData.value, data.value);

    scrollIntoBlockView(newBlock, false, 'bottom', 'auto');

    const selectedUuid = useState<string>('toc-selected-uuid');
    selectedUuid.value = newBlock.meta.uuid;
    openDrawerWithView('TableOfContents');
  };

  const scrollIntoBlockView = (
    block: Block,
    scrollToPlaceholder: boolean = false,
    position?: 'top' | 'bottom',
    behaviour: 'auto' | 'instant' | 'smooth' = 'smooth',
  ) => {
    setTimeout(() => {
      let el: Element | null = null;

      if (scrollToPlaceholder && position) {
        const blockEl = document.querySelector(`[data-uuid="${block.meta.uuid}"]`);
        if (blockEl) {
          const parentWrapper = blockEl.closest('div');
          if (parentWrapper) {
            const placeholder = parentWrapper.querySelector('[data-testid="block-placeholder"]');
            if (placeholder) {
              el = placeholder;
            }
          }
        }
        if (!el) {
          el = document.querySelector('[data-testid="block-placeholder"]');
        }
      } else {
        el = document.querySelector(`[data-uuid="${block.meta.uuid}"]`);
      }

      if (el) {
        el.scrollIntoView({ behavior: behaviour, block: 'center' });
      }
    }, 100);
  };

  const insertIntoColumn = (targetBlock: Block, newBlock: Block, parent: Block[]) => {
    const colIndex = parent.findIndex((block) => block.meta?.uuid === targetBlock.meta?.uuid);

    newBlock.parent_slot = targetBlock.parent_slot;

    if (colIndex === -1) {
      send({ type: 'negative', message: `Couldn't insert block.` });
      return;
    }

    const updatedBlock = {
      ...newBlock,
    };

    parent.splice(colIndex, 1, updatedBlock);
  };

  const insertNextToBlock = (parent: Block[], index: number, newBlock: Block, position: BlockPosition) => {
    if (Array.isArray(newBlock.content) && newBlock.content.length) {
      setUuid(newBlock.content as Block[]);
    }
    const insertIndex = position === 'top' ? index : index + 1;
    parent.splice(insertIndex, 0, newBlock);
  };

  const changeBlockPosition = (index: number, position: number) => {
    const updatedBlocks = [...pageBlocks.value];
    const newIndex = index + position;

    if (newIndex < 0 || newIndex >= updatedBlocks.length) return;

    const blockToChange = updatedBlocks.splice(index, 1)[0];
    if (!blockToChange) return;
    updatedBlocks.splice(newIndex, 0, blockToChange);

    updateBlocks(updatedBlocks);

    const movedBlock = updatedBlocks[newIndex];
    if (!movedBlock) return;

    globalThis.dispatchEvent(
      new CustomEvent('block-moved', {
        detail: { uuid: movedBlock.meta.uuid, name: movedBlock.name },
      }),
    );

    isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
  };

  const isLastNonFooterBlock = (index: number) => {
    if (!pageBlocks.value || pageBlocks.value.length === 0) return false;
    return index === pageBlocks.value.length - 1;
  };

  const isFirstContentBlock = (index: number): boolean => {
    return index === 0;
  };

  const findBlockParent = (blocks: Block[], targetUuid: string): { parent: Block[]; index: number } | null => {
    for (const [index, block] of blocks.entries()) {
      if (block.meta?.uuid === targetUuid) {
        return { parent: blocks, index };
      }
      if (Array.isArray(block.content) && block.content.length) {
        const result = findBlockParent(block.content, targetUuid);
        if (result) return result;
      }
    }
    return null;
  };

  const blockContainsUuid = (block: Block, targetUuid: string): boolean => {
    if (block.meta?.uuid === targetUuid) return true;

    return (
      block.type === 'structure' &&
      Array.isArray(block.content) &&
      block.content.some((child) => blockContainsUuid(child, targetUuid))
    );
  };

  const getRootParent = (blocks: Block[], targetUuid: string): Block | null => {
    return blocks.find((rootBlock) => blockContainsUuid(rootBlock, targetUuid)) ?? null;
  };

  const getAncestorChain = (blocks: Block[], targetUuid: string): Block[] | null => {
    for (const block of blocks) {
      if (block.meta?.uuid === targetUuid) {
        return [block];
      }
      if (Array.isArray(block.content) && block.content.length) {
        const sub = getAncestorChain(block.content as Block[], targetUuid);
        if (sub) {
          return [block, ...sub];
        }
      }
    }
    return null;
  };

  const setUuid = (blocks: Block[]) => {
    for (const block of blocks) {
      block.meta.uuid = uuid();
      if (Array.isArray(block.content)) {
        setUuid(block.content);
      }
    }
  };

  const findOrDeleteBlockByUuid: (blocks: Block[], targetUuid: string, deleteBlock?: boolean) => Block | null = (
    blocks: Block[],
    targetUuid: string,
    deleteBlock = false,
  ) => {
    for (const [index, block] of blocks.entries()) {
      if (block.meta?.uuid === targetUuid) {
        if (deleteBlock) {
          blocks.splice(index, 1);
        }
        return block;
      }
      if (Array.isArray(block.content)) {
        const result = findOrDeleteBlockByUuid(block.content, targetUuid, deleteBlock);
        if (result) return result;
      }
    }
    return null;
  };

  const deleteFromHeaderContainer = (uuid: string) => {
    if (!isHeaderContainerBlock(headerContainer.value) || !Array.isArray(headerContainer.value.content)) return;

    const content = headerContainer.value.content as Block[];
    const topLevelIdx = content.findIndex((block) => block.meta.uuid === uuid);

    if (topLevelIdx >= 0) {
      if (content.length <= 1) return;
      content.splice(topLevelIdx, 1);
      return;
    }

    findOrDeleteBlockByUuid(content, uuid, true);
  };

  const deleteFromFooterContainer = (uuid: string) => {
    if (!isFooterContainerBlock(footer.value) || !Array.isArray(footer.value.content)) return;
    findOrDeleteBlockByUuid(footer.value.content as Block[], uuid, true);
  };

  const deleteBlock = async (uuid: string) => {
    if (!pageBlocks.value) return;

    if (getBlockDepth(uuid) > 0) {
      await deleteBlockFromColumn(uuid);
    } else if (!findOrDeleteBlockByUuid(pageBlocks.value, uuid, true)) {
      deleteFromHeaderContainer(uuid);
      deleteFromFooterContainer(uuid);
    }

    isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
    closeBlocksConfigurationDrawer();
  };

  const tabletEdit = (index: number) => {
    if (isTablet.value) {
      isClicked.value = !isClicked.value;
      clickedBlockIndex.value = isClicked.value ? index : null;
    }
  };

  const handleEdit = (uuid: string) => {
    if (allBlocks.value) {
      currentBlockUuid.value = uuid;
      currentBlock.value = findOrDeleteBlockByUuid(allBlocks.value, uuid);
      isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
    }
  };

  const deleteBlockFromColumn = async (blockUuid: string) => {
    const parentInfo = findBlockParent(pageBlocks.value, blockUuid);
    if (parentInfo) {
      const { parent, index } = parentInfo;
      const layoutTemplate = await getBlockTemplateByLanguage('layout', 0, $i18n.locale.value);
      const layoutTemplateContent = layoutTemplate.content as Block[];
      const newBlock = { ...layoutTemplateContent[0] } as Block;

      const blockToDelete = parent[index];
      if (!blockToDelete) return;
      const targetSlot = blockToDelete.parent_slot;

      parent.splice(index, 1);

      const columnBlocks = parent.filter((block) => block.parent_slot === targetSlot);
      if (columnBlocks.length === 0) {
        newBlock.parent_slot = targetSlot;
        newBlock.meta.uuid = uuid();
        parent.splice(index, 0, newBlock);
      }
    }
  };

  const deleteBlockHard = (blockUuid: string) => {
    if (!pageBlocks.value) return;

    if (getBlockDepth(blockUuid) > 0) {
      const chain = getAncestorChain(pageBlocks.value, blockUuid);
      const parentBlock = chain && chain.length >= 2 ? chain[chain.length - 2] : null;
      if (!parentBlock || !removeBlockFromColumn(parentBlock, blockUuid)) return;
    } else if (!findOrDeleteBlockByUuid(pageBlocks.value, blockUuid, true)) {
      deleteFromHeaderContainer(blockUuid);
      deleteFromFooterContainer(blockUuid);
    }

    isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
    closeBlocksConfigurationDrawer();
  };
  const updateBlock = (index: number, updatedBlock: Block) => {
    if (pageBlocks.value && index !== null && index < pageBlocks.value.length) {
      pageBlocks.value[index] = updatedBlock;
    }
  };

  const handleDragStart = () => {
    dragState.isDragging = true;
  };

  const handleDragEnd = () => {
    dragState.isDragging = false;
  };

  const getBlockDepth = (uuid: string): number => {
    const search = (blocks: Block[], targetUuid: string, depth: number): number => {
      for (const block of blocks) {
        if (block.meta.uuid === targetUuid) return depth;
        if (block.type === 'structure' && Array.isArray(block.content)) {
          const found = search(block.content, targetUuid, depth + 1);
          if (found !== -1) return found;
        }
      }
      return -1;
    };
    return Array.isArray(pageBlocks.value) ? search(pageBlocks.value, uuid, 0) : -1;
  };

  const shouldLazyLoad = (blockName: string): boolean => {
    return blockName in LAZY_LOAD_BLOCKS;
  };

  const getLazyLoadKey = (blockName: string, blockUuid?: string): string => {
    const baseKey = blockName.charAt(0).toLowerCase() + blockName.slice(1);
    if (!blockUuid) {
      console.error('getLazyLoadKey called without blockUuid for', blockName);
      return `${baseKey}-missing-uuid`;
    }
    return `${baseKey}-${blockUuid}`;
  };

  const getLazyLoadConfig = (blockName: string): LazyLoadConfig | null => {
    return LAZY_LOAD_BLOCKS[blockName] || null;
  };

  const getLazyLoadRef = (blockName: string, blockUuid: string): RefCallback => {
    if (!shouldLazyLoad(blockName)) return () => {};

    return (ref) => {
      if (ref instanceof HTMLElement) lazyLoadRefs.value[getLazyLoadKey(blockName, blockUuid)] = ref;
    };
  };

  const showBottomAddInGrid = ({
    blockMetaUuid,
    blockName,
    isRowHovered,
    getBlockDepth,
  }: ShowBottomAddInGridOptions) => {
    const isInsideMultiGrid = getBlockDepth(blockMetaUuid) > 0;
    return isInsideMultiGrid && blockName !== 'EmptyGridBlock' && isRowHovered;
  };

  const blockExistsOnPage = (blockName: string): boolean => {
    const checkBlocks = (blocks: Block[]): boolean =>
      blocks.some((block) => block.name === blockName || (Array.isArray(block.content) && checkBlocks(block.content)));
    return checkBlocks(allBlocks.value);
  };

  const isStructureBlock = (block: Block): boolean => {
    return block.type === 'structure' && Array.isArray(block.content) && block.content.length > 0;
  };

  const shouldDisplayPlaceholder = (
    uuid: string,
    position: 'top' | 'bottom',
    drawerOpen: boolean | Ref<boolean>,
    drawerView: string | null | Ref<string | null>,
  ): boolean => {
    return (
      visiblePlaceholder.value.position === position &&
      visiblePlaceholder.value.uuid === uuid &&
      unref(drawerOpen) &&
      unref(drawerView) === 'blocksList'
    );
  };

  return {
    currentBlock,
    currentBlockUuid,
    isClicked,
    clickedBlockIndex,
    lazyLoadStates,
    lazyLoadRefs,
    isTablet,
    isDragging: computed(() => dragState.isDragging),
    handleDragStart,
    handleDragEnd,
    tabletEdit,
    deleteBlock,
    deleteBlockHard,
    updateBlock,
    changeBlockPosition,
    isLastNonFooterBlock,
    isFirstContentBlock,
    addNewBlock,
    insertCustomBlock,
    scrollIntoBlockView,
    handleEdit,
    visiblePlaceholder,
    togglePlaceholder,
    findOrDeleteBlockByUuid,
    getRootParent,
    getBlockDepth,
    shouldLazyLoad,
    getLazyLoadKey,
    getLazyLoadConfig,
    getLazyLoadRef,
    showBottomAddInGrid,
    blockExistsOnPage,
    isStructureBlock,
    shouldDisplayPlaceholder,
  };
};
