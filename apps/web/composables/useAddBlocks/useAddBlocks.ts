import homepageTemplateDataEn from '../useHomepage/homepageTemplateDataEn.json';
import homepageTemplateDataDe from '../useHomepage/homepageTemplateDataDe.json';

export const useAddBlocks = () => {
  const { data, initialBlocks } = useHomepage();
  const { $i18n } = useNuxtApp();
  const { displayBlockList, isEditingEnabled } = useEditor();

  const getBlockFromJson = (component: string) => {
    const blocks = $i18n.locale.value === 'en' ? homepageTemplateDataEn.blocks : homepageTemplateDataDe.blocks;
    return blocks.find((block) => block.name === component);
  };

  const addNewBlock = (component: string, index: number) => {
    displayBlockList.value = true;
    const newBlock = getBlockFromJson(component);
    if (!newBlock) return;

    const updatedBlocks = [...data.value.blocks];
    updatedBlocks.splice(index, 0, newBlock);
    data.value.blocks = updatedBlocks;
    isEditingEnabled.value = !deepEqual(initialBlocks.value, data.value.blocks);
  };

  return {
    addNewBlock,
  };
};
