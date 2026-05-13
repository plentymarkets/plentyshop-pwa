import type { QuickAddOption } from '~/components/editor/QuickAdd/types';
import type { Block } from '@plentymarkets/shop-api';

export const useQuickAdd = (getLastChild: () => Block | undefined) => {
  const { insertCustomBlock } = useBlockManager();
  const { getBlockTemplateByLanguage } = useBlocksList();

  const quickAddBlock = async (option: QuickAddOption) => {
    const { $i18n } = useNuxtApp();
    const newBlock = await getBlockTemplateByLanguage(option.category, option.variationIndex, $i18n.locale.value);

    const lastChild = getLastChild();
    if (!lastChild) return;

    insertCustomBlock(newBlock, lastChild.meta.uuid, 'bottom');
  };

  return { quickAddBlock };
};
