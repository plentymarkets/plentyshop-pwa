import type {
  UtilityBarContent,
  SectionType,
  UtilityBarSection,
  ActionType,
  SpacingSettings,
  UtilityBarColor,
} from '~/components/blocks/UtilityBar/types';

const DEFAULT_LAYOUT: SpacingSettings = {
  paddingTop: 20,
  paddingBottom: 20,
  paddingLeft: 40,
  paddingRight: 40,
};

const DEFAULT_COLOR: UtilityBarColor = {
  iconColor: '#fff',
  backgroundColor: 'rgb(var(--colors-2-primary-500))',
};

const DEFAULT_SECTION_ORDER: SectionType[] = ['logo', 'search', 'actions'];

const DEFAULT_SECTION_VISIBILITY: Record<SectionType, boolean> = {
  logo: true,
  search: true,
  actions: true,
};

const DEFAULT_ACTION_ORDER: ActionType[] = ['language', 'wishlist', 'cart', 'account'];

const DEFAULT_ACTION_VISIBILITY: Record<ActionType, boolean> = {
  language: true,
  wishlist: true,
  cart: true,
  account: true,
};

const createDefaultContent = (): UtilityBarContent => ({
  layout: { ...DEFAULT_LAYOUT },
  sectionOrder: { sections: [...DEFAULT_SECTION_ORDER] },
  sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
  color: { ...DEFAULT_COLOR },
  logo: { logo: '' },
  search: { displayMode: 'full' },
  actions: {
    order: [...DEFAULT_ACTION_ORDER],
    visibility: { ...DEFAULT_ACTION_VISIBILITY },
  },
});

/** Merges incoming (possibly partial) content with defaults to ensure all fields exist */
const mergeWithDefaults = (incoming: Partial<UtilityBarContent> | undefined): UtilityBarContent => {
  if (!incoming) return createDefaultContent();

  const defaults = createDefaultContent();
  return {
    layout: { ...defaults.layout, ...incoming.layout },
    sectionOrder: {
      sections: incoming.sectionOrder?.sections?.length
        ? [...incoming.sectionOrder.sections]
        : [...defaults.sectionOrder.sections],
    },
    sectionVisibility: { ...defaults.sectionVisibility, ...incoming.sectionVisibility } as Record<SectionType, boolean>,
    logo: incoming.logo || defaults.logo,
    search: { ...defaults.search, ...incoming.search },
    color: { ...defaults.color, ...incoming.color },
    actions: {
      order: incoming.actions?.order?.length ? [...incoming.actions.order] : [...defaults.actions.order],
      visibility: { ...defaults.actions.visibility, ...incoming.actions?.visibility },
    },
  };
};

/**
 * Scoped state store for a UtilityBar block.
 * Uses a UUID-scoped key so multiple instances cannot overwrite each other.
 */
export const useUtilityBarState = (_uuid?: string) => {
  // Keep state isolated per UtilityBar instance so multiple blocks cannot overwrite each other.
  const stateKey = _uuid ? `utilityBarContent:${_uuid}` : 'utilityBarContent';
  const state = useState<UtilityBarContent>(stateKey, () => createDefaultContent());

  /** Replace state content, merging with defaults to fill any missing fields */
  const setContent = (incoming: Partial<UtilityBarContent> | undefined) => {
    state.value = mergeWithDefaults(incoming);
  };

  const content = computed<UtilityBarContent>({
    get: () => state.value,
    set: (newContent: UtilityBarContent) => {
      state.value = newContent;
    },
  });

  // -- Layout --

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

  // -- Sections --

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
      const order: SectionType[] = content.value.sectionOrder?.sections || DEFAULT_SECTION_ORDER;
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

  // -- Actions --

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

  // -- Search --

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
