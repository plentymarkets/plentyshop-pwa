/**
 * Copies and pastes the body of an editable page (header and footer excluded) via the system clipboard.
 * Pasting is two steps: `requestPaste` reads and checks the clipboard and exposes the result as `pendingPaste`
 * for a confirmation, then `confirmPaste` replaces the page body.
 */
export const useBlockClipboard = () => {
  const pendingPaste = useState<FilteredPageBlocks | null>('useBlockClipboard', () => null);
  const { pageBlocks, updateBlocks } = useBlocks();
  const { isEditingEnabled } = useEditor();
  const { send } = useNotification();
  const { blocksLists, blocksListContext, getBlocksLists } = useBlocksList();

  const copyPageBlocks = async () => {
    try {
      await navigator.clipboard.writeText(serializePageTemplate(pageBlocks.value));
      send({ message: getEditorUITranslation('pageTemplateCopied'), type: 'positive' });
      return true;
    } catch {
      send({ message: getEditorUITranslation('pageTemplateCopyError'), type: 'negative' });
      return false;
    }
  };

  const requestPaste = async () => {
    try {
      const blocks = parsePageTemplate(await navigator.clipboard.readText());
      if (!blocks) {
        send({ message: getEditorUITranslation('pageTemplateInvalid'), type: 'negative' });
        return false;
      }
      if (!blocksListContext.value) {
        send({ message: getEditorUITranslation('pageTemplateContextUnknown'), type: 'negative' });
        return false;
      }
      if (!Object.keys(blocksLists.value).length) {
        await getBlocksLists();
      }
      pendingPaste.value = filterBlocksForContext(
        blocks,
        blocksListContext.value,
        getBlockAccessMap(blocksLists.value),
        (name) => Boolean(getBlockLoader(name)),
      );
      return true;
    } catch {
      send({ message: getEditorUITranslation('pageTemplatePasteError'), type: 'negative' });
      return false;
    }
  };

  const cancelPaste = () => {
    pendingPaste.value = null;
  };

  const confirmPaste = () => {
    const pending = pendingPaste.value;
    if (!pending) {
      return;
    }
    const blocks = deepClone(pending.blocks);
    regenerateBlockUuids(blocks);
    migrateAllBlocks(blocks);
    updateBlocks(blocks);
    isEditingEnabled.value = true;
    pendingPaste.value = null;
    send({ message: getEditorUITranslation('pageTemplatePasted'), type: 'positive' });
  };

  return { pendingPaste, copyPageBlocks, requestPaste, cancelPaste, confirmPaste };
};
