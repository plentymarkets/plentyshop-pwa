import type { UtilityBarProps, SectionType, UtilityBarSection } from '~/components/blocks/UtilityBar/types';

const DEFAULT_LAYOUT = {
  paddingTop: 20,
  paddingBottom: 20,
  paddingLeft: 40,
  paddingRight: 40,
};

const DEFAULT_SECTION_ORDER: SectionType[] = ['logo', 'search', 'actions'];

const DEFAULT_SECTION_VISIBILITY: Record<SectionType, boolean> = {
  logo: true,
  search: true,
  actions: true,
};

const DEFAULT_ACTION_ORDER: UtilityBarProps['content']['actions']['order'] = [
  'language',
  'wishlist',
  'cart',
  'account',
];

const DEFAULT_ACTION_VISIBILITY: UtilityBarProps['content']['actions']['visibility'] = {
  language: true,
  wishlist: true,
  cart: true,
  account: true,
};

const createDefaultConfiguration = (): UtilityBarProps['content'] => ({
  layout: { ...DEFAULT_LAYOUT },
  sectionOrder: { sections: [...DEFAULT_SECTION_ORDER] },
  sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
  logo: { logo: '' },
  search: { displayMode: 'full' },
  actions: {
    order: [...DEFAULT_ACTION_ORDER],
    visibility: { ...DEFAULT_ACTION_VISIBILITY },
  },
});

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

const ensureUtilityBarConfiguration = (
  block: UtilityBarProps | null,
  previousConfiguration: UtilityBarProps['content'] | null,
) => {
  if (!block) {
    return;
  }

  if (!block.content) {
    block.content = previousConfiguration ? { ...createDefaultConfiguration(), ...previousConfiguration } : createDefaultConfiguration();
    return;
  }

  if (!block.content.layout) {
    block.content.layout = previousConfiguration?.layout ? { ...previousConfiguration.layout } : { ...DEFAULT_LAYOUT };
  }

  if (block.content.layout.paddingTop === undefined) {
    block.content.layout.paddingTop = previousConfiguration?.layout?.paddingTop ?? DEFAULT_LAYOUT.paddingTop;
  }
  if (block.content.layout.paddingBottom === undefined) {
    block.content.layout.paddingBottom = previousConfiguration?.layout?.paddingBottom ?? DEFAULT_LAYOUT.paddingBottom;
  }
  if (block.content.layout.paddingLeft === undefined) {
    block.content.layout.paddingLeft = previousConfiguration?.layout?.paddingLeft ?? DEFAULT_LAYOUT.paddingLeft;
  }
  if (block.content.layout.paddingRight === undefined) {
    block.content.layout.paddingRight = previousConfiguration?.layout?.paddingRight ?? DEFAULT_LAYOUT.paddingRight;
  }

  if (!block.content.sectionOrder) {
    block.content.sectionOrder = previousConfiguration?.sectionOrder
      ? { sections: [...previousConfiguration.sectionOrder.sections] }
      : { sections: [...DEFAULT_SECTION_ORDER] };
  }

  if (!block.content.sectionOrder.sections?.length) {
    block.content.sectionOrder.sections = previousConfiguration?.sectionOrder?.sections?.length
      ? [...previousConfiguration.sectionOrder.sections]
      : [...DEFAULT_SECTION_ORDER];
  }

  if (!block.content.sectionVisibility) {
    block.content.sectionVisibility = previousConfiguration?.sectionVisibility
      ? { ...DEFAULT_SECTION_VISIBILITY, ...previousConfiguration.sectionVisibility }
      : { ...DEFAULT_SECTION_VISIBILITY };
  }

  if (!block.content.logo) {
    block.content.logo = previousConfiguration?.logo ? { ...previousConfiguration.logo } : { logo: '' };
  }

  if (!block.content.search) {
    block.content.search = previousConfiguration?.search ? { ...previousConfiguration.search } : { displayMode: 'full' };
  }

  if (!block.content.actions) {
    block.content.actions = previousConfiguration?.actions
      ? {
          order: [...previousConfiguration.actions.order],
          visibility: { ...DEFAULT_ACTION_VISIBILITY, ...previousConfiguration.actions.visibility },
        }
      : {
          order: [...DEFAULT_ACTION_ORDER],
          visibility: { ...DEFAULT_ACTION_VISIBILITY },
        };
  }

  if (!block.content.actions.order?.length) {
    block.content.actions.order = previousConfiguration?.actions?.order?.length
      ? [...previousConfiguration.actions.order]
      : [...DEFAULT_ACTION_ORDER];
  }

  if (!block.content.actions.visibility) {
    block.content.actions.visibility = previousConfiguration?.actions?.visibility
      ? { ...DEFAULT_ACTION_VISIBILITY, ...previousConfiguration.actions.visibility }
      : { ...DEFAULT_ACTION_VISIBILITY };
  }
};

/**
 * Manages UtilityBar block configuration state.
 * Handles block data retrieval, configuration access, and section computation.
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
  const lastKnownConfiguration = ref<UtilityBarProps['content'] | null>(null);
  const detachedConfiguration = ref<UtilityBarProps['content']>(createDefaultConfiguration());

  const utilityBarBlock = computed<UtilityBarProps | null>(
    () => {
      const blockByUuid = findOrDeleteBlockByUuid(data.value, blockUuid.value) as UtilityBarProps | null;
      const block = blockByUuid || findBlockByName(data.value, 'UtilityBar');
      ensureUtilityBarConfiguration(block, lastKnownConfiguration.value);

      if (block?.content) {
        lastKnownConfiguration.value = block.content;
      }

      return block;
    },
  );

  const content = computed<UtilityBarProps['content']>({
    get: () => {
      if (utilityBarBlock.value?.content) {
        return utilityBarBlock.value.content;
      }

      if (lastKnownConfiguration.value) {
        return lastKnownConfiguration.value;
      }

      return detachedConfiguration.value;
    },
    set: (newConfiguration) => {
      if (utilityBarBlock.value) {
        utilityBarBlock.value.content = newConfiguration;
        lastKnownConfiguration.value = newConfiguration;
      } else {
        detachedConfiguration.value = newConfiguration;
      }
    },
  });

  const sections = computed<UtilityBarSection[]>({
    get: () => {
      const order: SectionType[] = content.value.sectionOrder?.sections || ['logo', 'search', 'actions'];
      return order.map(
        (id): UtilityBarSection => ({
          id,
          name: `UtilityBar${id.charAt(0).toUpperCase()}${id.slice(1)}`,
          visible: content.value.sectionVisibility?.[id] !== false,
        }),
      );
    },
    set: (value: UtilityBarSection[]) => {
      if (!content.value.sectionOrder) {
        content.value.sectionOrder = { sections: [] };
      }
      content.value.sectionOrder.sections = value.map((section) => section.id);

      if (!content.value.sectionVisibility) {
        content.value.sectionVisibility = { logo: true, search: true, actions: true };
      }

      const sectionVisibility = content.value.sectionVisibility;
      value.forEach((section) => {
        sectionVisibility[section.id] = section.visible !== false;
      });
    },
  });

  return {
    utilityBarBlock,
    content,
    sections,
  };
};
