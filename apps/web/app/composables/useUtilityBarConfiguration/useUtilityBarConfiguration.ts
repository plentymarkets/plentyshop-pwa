import type { UtilityBarProps } from '~/components/blocks/UtilityBar/types';
import { deepEqual } from '~/utils/jsonHelper';
import { collectUtilityBarBlocks } from './helpers/collect-utility-bar-blocks';

/**
 * Manages UtilityBar block data retrieval and syncs it to the global state store.
 * Defaults are applied exclusively by useUtilityBarState.setContent (single source of truth).
 * No mutations happen inside computeds — block data stays clean for dirty detection.
 */
export const useUtilityBarConfiguration = (uuid?: string) => {
  const { blockUuid } = useSiteConfiguration();
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const { data } = useBlockTemplates(
    route?.meta?.identifier as string,
    route.meta.type as string,
    nuxtApp.$i18n.locale.value,
  );

  const { headerContainerCache } = useBlockTemplates('index', 'immutable', nuxtApp.$i18n.locale.value);
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

  const utilityBarBlock = computed<UtilityBarProps | null>(() => {
    if (targetUuid.value) {
      const blockByUuid = findOrDeleteBlockByUuid(data.value, targetUuid.value) as UtilityBarProps | null;
      if (blockByUuid) return blockByUuid;

      if (headerContainerCache.value?.content) {
        const blockInHeader = findOrDeleteBlockByUuid(
          headerContainerCache.value.content,
          targetUuid.value,
        ) as UtilityBarProps | null;
        if (blockInHeader) return blockInHeader;
      }
    }

    const utilityBarMatches = collectUtilityBarBlocks(data.value);
    if (utilityBarMatches.length === 1) {
      return utilityBarMatches[0] || null;
    }

    return null;
  });

  watch(
    () => utilityBarBlock.value,
    (block) => {
      if (!block) {
        return;
      }

      if (!deepEqual(stateContent.value, block.content)) {
        setContent(block.content);
      }
    },
    { immediate: true },
  );

  watch(
    stateContent,
    (newContent) => {
      const block = utilityBarBlock.value;
      if (block && newContent) {
        if (deepEqual(block.content, newContent)) {
          return;
        }

        block.content = JSON.parse(JSON.stringify(newContent));
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
