import { ref, computed, onMounted } from 'vue';
import { deepEqual } from '~/utils/jsonHelper';

const isEmptyBlock = (block: Block): boolean => {
  const options = block?.options;
  return !options || (typeof options === 'object' && Object.keys(options).length === 0);
};
const blockHasData = (block: Block): boolean => !isEmptyBlock(block);

export function useBlockManager() {
  const { data, initialBlocks } = useHomepage();
  const { isEditing, isEditingEnabled } = useEditor();

  const currentBlock = ref<Block | null>(null);
  const currentBlockIndex = ref<number | null>(null);
  const isClicked = ref(false);
  const clickedBlockIndex = ref<number | null>(null);

  const viewport = useViewport();
  const isTablet = computed(() => viewport.isLessThan('lg') && viewport.isGreaterThan('sm'));

  const isPreview = ref(false);
  const experimentalAddBlock = ref(useRuntimeConfig().public.experimentalAddBlock);

  onMounted(() => {
    const config = useRuntimeConfig().public;
    const showConfigurationDrawer = config.showConfigurationDrawer;
    const pwaCookie = useCookie('pwa');
    isPreview.value = !!pwaCookie.value || (showConfigurationDrawer as boolean);
  });

  const tabletEdit = (index: number) => {
    if (isTablet.value) {
      isClicked.value = !isClicked.value;
      clickedBlockIndex.value = isClicked.value ? index : null;
    }
  };

  const handleEdit = (index: number) => {
    if (data.value.blocks && data.value.blocks.length > index) {
      currentBlockIndex.value = index;
      currentBlock.value = data.value.blocks[index];
      isEditing.value = true;
    }
  };

  const deleteBlock = (index: number) => {
    if (data.value.blocks && index !== null && index < data.value.blocks.length) {
      data.value.blocks.splice(index, 1);
      isEditingEnabled.value = !deepEqual(initialBlocks.value, data.value.blocks);
    }
  };

  const updateBlock = (index: number, updatedBlock: Block) => {
    if (data.value.blocks && index !== null && index < data.value.blocks.length) {
      data.value.blocks[index] = updatedBlock;
    }
  };

  return {
    currentBlock,
    currentBlockIndex,
    isClicked,
    clickedBlockIndex,
    isTablet,
    isPreview,
    experimentalAddBlock,
    blockHasData,
    tabletEdit,
    handleEdit,
    deleteBlock,
    updateBlock,
  };
}
