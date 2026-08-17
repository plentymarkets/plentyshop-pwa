import type { UtilityBarContent, UtilityBarSection } from '~/components/blocks/UtilityBar/types';

import {
  createDefaultContent,
  DEFAULT_ACTION_ORDER,
  DEFAULT_ACTION_VISIBILITY,
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_VISIBILITY,
} from './helpers/create-default-content';
import { mergeWithDefaults } from './helpers/merge-with-defaults';

/**
 * Scoped state store for a UtilityBar block.
 * Uses a UUID-scoped key so multiple instances cannot overwrite each other.
 */
export const useUtilityBarState = (_uuid?: string) => {
  const stateKey = _uuid ? `utilityBarContent:${_uuid}` : 'utilityBarContent';
  const state = useState<UtilityBarContent>(stateKey, () => createDefaultContent());

  const setContent = (incoming: Partial<UtilityBarContent> | undefined) => {
    state.value = mergeWithDefaults(incoming);
  };

  const content = computed<UtilityBarContent>({
    get: () => state.value,
    set: (newContent: UtilityBarContent) => {
      state.value = newContent;
    },
  });

  const paddingStyles = computed(() => {
    const layout = content.value.layout;
    if (!layout) return {};
    return {
      paddingTop: layout.paddingTop != null ? `${layout.paddingTop}px` : undefined,
      paddingBottom: layout.paddingBottom != null ? `${layout.paddingBottom}px` : undefined,
      paddingLeft: layout.paddingLeft != null ? `${layout.paddingLeft}px` : undefined,
      paddingRight: layout.paddingRight != null ? `${layout.paddingRight}px` : undefined,
    };
  });

  const orderedVisibleSections = computed(() => {
    const order = content.value.sectionOrder?.sections || DEFAULT_SECTION_ORDER;
    const visibility = content.value.sectionVisibility || DEFAULT_SECTION_VISIBILITY;

    return order
      .filter((sectionId) => visibility[sectionId] !== false)
      .map((sectionId, index) => ({ sectionId, order: index }));
  });

  const getSectionFlexOrder = (sectionId: string): number => {
    const section = orderedVisibleSections.value.find((item) => item.sectionId === sectionId);
    return section?.order ?? 999;
  };

  const isSectionVisible = (sectionId: string): boolean => {
    return orderedVisibleSections.value.some((item) => item.sectionId === sectionId);
  };

  const sections = computed<UtilityBarSection[]>({
    get: () => {
      const order = content.value.sectionOrder?.sections || DEFAULT_SECTION_ORDER;
      return order.map(
        (id): UtilityBarSection => ({
          id,
          name: `UtilityBar${id.charAt(0).toUpperCase()}${id.slice(1)}`,
          visible: content.value.sectionVisibility?.[id] !== false,
        }),
      );
    },
    set: (value: UtilityBarSection[]) => {
      const updated = { ...state.value };
      updated.sectionOrder = { sections: value.map((section) => section.id) };
      updated.sectionVisibility = { ...DEFAULT_SECTION_VISIBILITY };

      value.forEach((section) => {
        updated.sectionVisibility![section.id] = section.visible !== false;
      });

      state.value = updated;
    },
  });

  const orderedActions = computed(() => {
    const order = content.value.actions?.order || DEFAULT_ACTION_ORDER;
    const visibility = content.value.actions?.visibility || DEFAULT_ACTION_VISIBILITY;

    return order
      .filter((actionId) => visibility[actionId] !== false)
      .map((actionId, index) => ({ actionId, order: index }));
  });

  const isActionVisible = (actionId: string): boolean => {
    return orderedActions.value.some((action) => action.actionId === actionId);
  };

  const getActionOrder = (actionId: string): number => {
    const action = orderedActions.value.find((item) => item.actionId === actionId);
    return action?.order ?? 999;
  };

  const isFullSearchMode = computed(() => content.value.search?.displayMode === 'full');

  return {
    content,
    sections,
    setContent,
    paddingStyles,
    orderedVisibleSections,
    getSectionFlexOrder,
    isSectionVisible,
    orderedActions,
    isActionVisible,
    getActionOrder,
    isFullSearchMode,
  };
};
