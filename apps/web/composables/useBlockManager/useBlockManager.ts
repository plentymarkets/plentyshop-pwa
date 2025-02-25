import { deepEqual } from '~/utils/jsonHelper';
import { blocksLists } from '~/blocks/blocksLists';

const isEmptyBlock = (block: Block): boolean => {
  const options = block?.content;
  return !options || (typeof options === 'object' && Object.keys(options).length === 0);
};
const blockHasData = (block: Block): boolean => !isEmptyBlock(block);
const visiblePlaceholder = ref<{ index: number | null; position: 'top' | 'bottom' | null }>({
  index: null,
  position: null,
});
const togglePlaceholder = (index: number, position: 'top' | 'bottom') => {
  visiblePlaceholder.value = { index, position };
};

export const useBlockManager = () => {
  const { $i18n } = useNuxtApp();
  const { data, cleanData, updateBlocks } = useCategoryTemplate();
  const { isEditing, isEditingEnabled } = useEditor();

  const currentBlock = ref<Block | null>(null);
  const currentBlockUuid = ref<string | null>(null);
  const isClicked = ref(false);
  const clickedBlockIndex = ref<number | null>(null);

  const viewport = useViewport();
  const isTablet = computed(() => viewport.isLessThan('lg') && viewport.isGreaterThan('sm'));

  const isPreview = ref(false);

  const getTemplateByLanguage = (category: string, variationIndex: number, lang: string) => {
    const variationsInCategory = blocksLists[category];
    const variationToAdd = variationsInCategory.variations[variationIndex];
    const variationTemplate = variationToAdd.template;

    return lang === 'de' ? variationTemplate.de : variationTemplate.en;
  };

  const addNewBlock = (category: string, variationIndex: number, position: number) => {
    const updatedBlocks = [...data.value];
    const newBlock = getTemplateByLanguage(category, variationIndex, $i18n.locale.value);

    updatedBlocks.splice(position, 0, newBlock);

    updateBlocks(updatedBlocks);
    visiblePlaceholder.value = { index: null, position: null };
    isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
  };

  const changeBlockPosition = (index: number, position: number) => {
    const updatedBlocks = [...data.value];
    const newIndex = index + position;

    if (newIndex < 0 || newIndex >= updatedBlocks.length) return;

    const blockToChange = updatedBlocks.splice(index, 1)[0];
    updatedBlocks.splice(newIndex, 0, blockToChange);

    updateBlocks(updatedBlocks);

    isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
  };

  const isLastBlock = (index: number) => index === data.value.length - 1;

  onMounted(() => {
    const config = useRuntimeConfig().public;
    const showConfigurationDrawer = config.showConfigurationDrawer;
    const pwaCookie = useCookie('pwa');
    isPreview.value = !!pwaCookie.value || (showConfigurationDrawer as boolean);
  });

  const findBlockByUuid: (blocks: Block[], targetUuid: string, deleteBlock?: boolean) => Block | null = (
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
        const result = findBlockByUuid(block.content, targetUuid, deleteBlock);
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
      currentBlock.value = findBlockByUuid(data.value, uuid);
      isEditing.value = true;
    }
  };

  const deleteBlock = (uuid: string) => {
    if (data.value && uuid !== null) {
      findBlockByUuid(data.value, uuid, true);
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

  return {
    currentBlock,
    currentBlockUuid,
    isClicked,
    clickedBlockIndex,
    isTablet,
    isPreview,
    blockHasData,
    tabletEdit,
    handleEdit,
    deleteBlock,
    updateBlock,
    changeBlockPosition,
    isLastBlock,
    addNewBlock,
    visiblePlaceholder,
    togglePlaceholder,
    findBlockByUuid,
  };
};
