import type { QuickAddOption } from '~/components/editor/QuickAdd/types';
import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';

type InsertBlockFn = (newBlock: Block) => void;

export const useQuickAdd = (getLastChild: () => Block | undefined, customInsert?: InsertBlockFn) => {
  const { insertCustomBlock } = useBlockManager();
  const { getBlockTemplateByLanguage } = useBlocksList();
  const { isEditingEnabled } = useEditor();
  const { data, cleanData } = useBlocks();

  const quickAddBlock = async (option: QuickAddOption) => {
    const { $i18n } = useNuxtApp();
    const newBlock = await getBlockTemplateByLanguage(option.category, option.variationIndex, $i18n.locale.value);

    if (customInsert) {
      newBlock.meta.uuid = uuid();
      if (Array.isArray(newBlock.content)) {
        for (const child of newBlock.content as Block[]) {
          child.meta.uuid = uuid();
        }
      }
      customInsert(newBlock);
      isEditingEnabled.value = !deepEqual(cleanData.value, data.value);
    } else {
      const lastChild = getLastChild();
      if (!lastChild) return;
      insertCustomBlock(newBlock, lastChild.meta.uuid, 'bottom');
    }
  };

  return { quickAddBlock };
};
