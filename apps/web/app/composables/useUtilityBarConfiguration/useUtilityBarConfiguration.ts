import type { UtilityBarProps } from '~/components/blocks/UtilityBar/types';

/**
 * Manages UtilityBar block data retrieval and syncs it to the global state store.
 * Defaults are applied exclusively by useUtilityBarState.setContent (single source of truth).
 * No mutations happen inside computeds — block data stays clean for dirty detection.
 */
export const useUtilityBarConfiguration = (uuid?: string) => {
  const { blockUuid } = useSiteConfiguration();
  const route = useRoute();
  const { data } = useBlockTemplates(
    route?.meta?.identifier as string,
    route.meta.type as string,
    useNuxtApp().$i18n.locale.value,
  );
  const { findOrDeleteBlockByUuid } = useBlockManager();

  const targetUuid = computed(() => uuid || blockUuid.value);
  const {
    content: stateContent,
    sections,
    setContent,
    paddingStyles,
    isSectionVisible,
    getSectionFlexOrder,
    isActionVisible,
    getActionOrder,
    isFullSearchMode,
  } = useUtilityBarState(targetUuid.value);

  let syncing = false;
  let initialized = false;

  // Pure computed — no side effects, no mutations
  const utilityBarBlock = computed<UtilityBarProps | null>(() => {
    if (!targetUuid.value) {
      return null;
    }

    return findOrDeleteBlockByUuid(data.value, targetUuid.value) as UtilityBarProps | null;
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
    paddingStyles,
    isSectionVisible,
    getSectionFlexOrder,
    isActionVisible,
    getActionOrder,
    isFullSearchMode,
  };
};
