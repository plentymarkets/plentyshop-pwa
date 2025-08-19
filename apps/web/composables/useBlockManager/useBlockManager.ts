import type { BlocksList } from '../../components/BlocksNavigationList/types';
import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';

const blocksLists = ref<BlocksList>({});

const isEmptyBlock = (block: Block): boolean => {
  const options = block?.content;
  return !options || (typeof options === 'object' && Object.keys(options).length === 0);
};
const blockHasData = (block: Block): boolean => !isEmptyBlock(block);
const visiblePlaceholder = ref<{ uuid: string; position: 'top' | 'bottom' }>({
  uuid: '',
  position: 'top',
});
const togglePlaceholder = (uuid: string, position: 'top' | 'bottom') => {
  visiblePlaceholder.value = { uuid, position };
};

const dragState = reactive({
  isDragging: false,
});

export const useBlockManager = () => {
  const { $i18n } = useNuxtApp();
  const { data, cleanData, updateBlocks } = useCategoryTemplate();
  const { isEditingEnabled } = useEditor();
  const { openDrawerWithView } = useSiteConfiguration();

  const currentBlock = ref<Block | null>(null);
  const currentBlockUuid = ref<string | null>(null);
  const isClicked = ref(false);
  const clickedBlockIndex = ref<number | null>(null);
  const viewport = useViewport();
  const isTablet = computed(() => viewport.isLessThan('lg') && viewport.isGreaterThan('sm'));

  const getBlocksLists = async () => {
    try {
      const response = await fetch('/_nuxt-plenty/editor/blocksLists.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      blocksLists.value = await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch blocksLists: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getTemplateByLanguage = (category: string, variationIndex: number, lang: string) => {
    const variationsInCategory = blocksLists.value[category];
    const variationToAdd = variationsInCategory.variations[variationIndex];
    const variationTemplate = variationToAdd.template;

    return JSON.parse(JSON.stringify(lang === 'de' ? variationTemplate.de : variationTemplate.en));
  };

  const addNewBlock = (category: string, variationIndex: number, targetUuid: string, position: 'top' | 'bottom') => {
    if (!data.value) return;
    const newBlock = getTemplateByLanguage(category, variationIndex, $i18n.locale.value);
    newBlock.meta.uuid = uuid();

    const nonFooterBlocks = data.value.filter((block: Block) => block.name !== 'Footer');
    if (nonFooterBlocks.length === 0) {
      updateBlocks([newBlock, ...data.value.filter((block: Block) => block.name === 'Footer')]);
      openDrawerWithView('blocksSettings', newBlock);
      return;
    }

    const copiedData = JSON.parse(JSON.stringify(data.value));
    const parentInfo = findBlockParent(copiedData, targetUuid);

    if (!parentInfo) {
      console.error('block not found');
      return;
    }

    const { parent, index } = parentInfo;

    if (Array.isArray(newBlock.content) && newBlock.content.length) {
      setUuid(newBlock.content as Block[]);
    }

    const insertIndex = position === 'top' ? index : index + 1;

    parent.splice(insertIndex, 0, newBlock);

    updateBlocks(copiedData);
    openDrawerWithView('blocksSettings', newBlock);
    visiblePlaceholder.value = { uuid: '', position: 'top' };
    isEditingEnabled.value = !deepEqual(cleanData.value, copiedData);
  };

  const changeBlockPosition = (index: number, position: number) => {
    const updatedBlocks = [...data.value];
    const newIndex = index + position;

    if (newIndex < 0 || newIndex >= updatedBlocks.length) return;

    const blockToChange = updatedBlocks.splice(index, 1)[0];
    updatedBlocks.splice(newIndex, 0, blockToChange);

    updateBlocks(updatedBlocks);

    const movedBlock = updatedBlocks[newIndex];

    window.dispatchEvent(
      new CustomEvent('block-moved', {
        detail: { uuid: movedBlock.meta.uuid, name: movedBlock.name },
      }),
    );

    isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
  };

  const isLastNonFooterBlock = (index: number) => {
    if (!data.value || data.value.length === 0) return false;
    const hasFooter = data.value.length > 0 && data.value[data.value.length - 1].name === 'Footer';
    const lastNonFooterIndex = hasFooter ? data.value.length - 2 : data.value.length - 1;
    return index === lastNonFooterIndex;
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
      if (block.meta && block.meta.uuid === targetUuid) {
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

  const tabletEdit = (index: number) => {
    if (isTablet.value) {
      isClicked.value = !isClicked.value;
      clickedBlockIndex.value = isClicked.value ? index : null;
    }
  };

  const handleEdit = (uuid: string) => {
    if (data.value) {
      currentBlockUuid.value = uuid;
      currentBlock.value = findOrDeleteBlockByUuid(data.value, uuid);
      isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
    }
  };

  const deleteBlock = (uuid: string) => {
    if (data.value && uuid !== null) {
      findOrDeleteBlockByUuid(data.value, uuid, true);
      isEditingEnabled.value = !deepEqual(cleanData.value, data.value);

      const { closeDrawer } = useSiteConfiguration();
      closeDrawer();
    }
  };

  const updateBlock = (index: number, updatedBlock: Block) => {
    if (data.value && index !== null && index < data.value.length) {
      data.value[index] = updatedBlock;
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
        if (block.meta.uuid === targetUuid) {
          console.log(`Block ${targetUuid} at depth ${depth}`);
          return depth;
        }
        if (block.type === 'structure' && Array.isArray(block.content)) {
          const found = search(block.content, targetUuid, depth + 1);
          if (found !== -1) return found;
        }
      }
      return -1;
    };
    const result = Array.isArray(data.value) ? search(data.value, uuid, 0) : -1;

    if (result === -1) {
      console.log(`Block ${uuid} not found!`);
    }
    return result;
    // return Array.isArray(data.value) ? search(data.value, uuid, 0) : -1;
  };

  return {
    blocksLists,
    currentBlock,
    currentBlockUuid,
    isClicked,
    clickedBlockIndex,
    isTablet,
    isDragging: computed(() => dragState.isDragging),
    handleDragStart,
    handleDragEnd,
    getBlocksLists,
    blockHasData,
    tabletEdit,
    deleteBlock,
    updateBlock,
    changeBlockPosition,
    isLastNonFooterBlock,
    addNewBlock,
    handleEdit,
    visiblePlaceholder,
    togglePlaceholder,
    findOrDeleteBlockByUuid,
    getBlockDepth,
  };
};
