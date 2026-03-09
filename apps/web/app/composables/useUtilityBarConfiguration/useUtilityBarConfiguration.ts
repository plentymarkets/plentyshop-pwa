import type { UtilityBarProps } from '~/components/blocks/UtilityBar/types';

const findBlockByName = (blocks: unknown, blockName: string): UtilityBarProps | null => {
  if (!Array.isArray(blocks)) {
    return null;
  }

  for (const block of blocks) {
    if (!block || typeof block !== 'object') {
      continue;
    }

    const candidate = block as UtilityBarProps;
    if (candidate.name === blockName) {
      return candidate;
    }

    if (Array.isArray(candidate.content)) {
      const nestedBlock = findBlockByName(candidate.content, blockName);
      if (nestedBlock) {
        return nestedBlock;
      }
    }
  }

  return null;
};

/**
 * Manages UtilityBar block data retrieval and syncs it to the global state store.
 * Defaults are applied exclusively by useUtilityBarState.setContent (single source of truth).
 * No mutations happen inside computeds — block data stays clean for dirty detection.
 */
export const useUtilityBarConfiguration = () => {
  const { blockUuid } = useSiteConfiguration();
  const route = useRoute();
  const { data } = useBlockTemplates(
    route?.meta?.identifier as string,
    route.meta.type as string,
    useNuxtApp().$i18n.locale.value,
  );
  const { findOrDeleteBlockByUuid } = useBlockManager();

  const { content: stateContent, sections, setContent } = useUtilityBarState();

  let syncing = false;
  let initialized = false;

  // Pure computed — no side effects, no mutations
  const utilityBarBlock = computed<UtilityBarProps | null>(() => {
    const blockByUuid = findOrDeleteBlockByUuid(data.value, blockUuid.value) as UtilityBarProps | null;
    return blockByUuid || findBlockByName(data.value, 'UtilityBar');
  });

  // Block → State: sync when block becomes available or changes (initial load, after save/reload)
  watch(
    () => utilityBarBlock.value,
    (block) => {
      if (block && !syncing) {
        syncing = true;
        // mergeWithDefaults fills in any missing fields for the UI
        setContent(block.content);
        initialized = true;
        nextTick(() => {
          syncing = false;
        });
      }
    },
    { immediate: true },
  );

  // State → Block: sync form edits back to block data so saves persist changes.
  // Only runs after initial load to avoid immediately dirtying the block data.
  // Uses deep clone to prevent shared object references between state and block.
  watch(
    stateContent,
    (newContent) => {
      const block = utilityBarBlock.value;
      if (block && newContent && !syncing && initialized) {
        syncing = true;
        block.content = JSON.parse(JSON.stringify(newContent));
        nextTick(() => {
          syncing = false;
        });
      }
    },
    { deep: true },
  );

  const content = computed<UtilityBarProps['content']>({
    get: () => stateContent.value,
    set: (newConfiguration) => {
      stateContent.value = newConfiguration;
    },
  });

  return {
    utilityBarBlock,
    content,
    sections,
  };
};
