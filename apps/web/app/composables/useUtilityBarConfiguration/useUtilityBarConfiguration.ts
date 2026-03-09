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

const DEFAULT_ACTION_ORDER: UtilityBarProps['configuration']['actions']['order'] = [
  'language',
  'wishlist',
  'cart',
  'account',
];

const DEFAULT_ACTION_VISIBILITY: UtilityBarProps['configuration']['actions']['visibility'] = {
  language: true,
  wishlist: true,
  cart: true,
  account: true,
};

const createDefaultConfiguration = (): UtilityBarProps['configuration'] => ({
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
  previousConfiguration: UtilityBarProps['configuration'] | null,
) => {
  if (!block) {
    return;
  }

  if (!block.configuration) {
    block.configuration = previousConfiguration ? { ...createDefaultConfiguration(), ...previousConfiguration } : createDefaultConfiguration();
    return;
  }

  if (!block.configuration.layout) {
    block.configuration.layout = previousConfiguration?.layout ? { ...previousConfiguration.layout } : { ...DEFAULT_LAYOUT };
  }

  if (block.configuration.layout.paddingTop === undefined) {
    block.configuration.layout.paddingTop = previousConfiguration?.layout?.paddingTop ?? DEFAULT_LAYOUT.paddingTop;
  }
  if (block.configuration.layout.paddingBottom === undefined) {
    block.configuration.layout.paddingBottom = previousConfiguration?.layout?.paddingBottom ?? DEFAULT_LAYOUT.paddingBottom;
  }
  if (block.configuration.layout.paddingLeft === undefined) {
    block.configuration.layout.paddingLeft = previousConfiguration?.layout?.paddingLeft ?? DEFAULT_LAYOUT.paddingLeft;
  }
  if (block.configuration.layout.paddingRight === undefined) {
    block.configuration.layout.paddingRight = previousConfiguration?.layout?.paddingRight ?? DEFAULT_LAYOUT.paddingRight;
  }

  if (!block.configuration.sectionOrder) {
    block.configuration.sectionOrder = previousConfiguration?.sectionOrder
      ? { sections: [...previousConfiguration.sectionOrder.sections] }
      : { sections: [...DEFAULT_SECTION_ORDER] };
  }

  if (!block.configuration.sectionOrder.sections?.length) {
    block.configuration.sectionOrder.sections = previousConfiguration?.sectionOrder?.sections?.length
      ? [...previousConfiguration.sectionOrder.sections]
      : [...DEFAULT_SECTION_ORDER];
  }

  if (!block.configuration.sectionVisibility) {
    block.configuration.sectionVisibility = previousConfiguration?.sectionVisibility
      ? { ...DEFAULT_SECTION_VISIBILITY, ...previousConfiguration.sectionVisibility }
      : { ...DEFAULT_SECTION_VISIBILITY };
  }

  if (!block.configuration.logo) {
    block.configuration.logo = previousConfiguration?.logo ? { ...previousConfiguration.logo } : { logo: '' };
  }

  if (!block.configuration.search) {
    block.configuration.search = previousConfiguration?.search ? { ...previousConfiguration.search } : { displayMode: 'full' };
  }

  if (!block.configuration.actions) {
    block.configuration.actions = previousConfiguration?.actions
      ? {
          order: [...previousConfiguration.actions.order],
          visibility: { ...DEFAULT_ACTION_VISIBILITY, ...previousConfiguration.actions.visibility },
        }
      : {
          order: [...DEFAULT_ACTION_ORDER],
          visibility: { ...DEFAULT_ACTION_VISIBILITY },
        };
  }

  if (!block.configuration.actions.order?.length) {
    block.configuration.actions.order = previousConfiguration?.actions?.order?.length
      ? [...previousConfiguration.actions.order]
      : [...DEFAULT_ACTION_ORDER];
  }

  if (!block.configuration.actions.visibility) {
    block.configuration.actions.visibility = previousConfiguration?.actions?.visibility
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
  const lastKnownConfiguration = ref<UtilityBarProps['configuration'] | null>(null);
  const detachedConfiguration = ref<UtilityBarProps['configuration']>(createDefaultConfiguration());

  const utilityBarBlock = computed<UtilityBarProps | null>(
    () => {
      const blockByUuid = findOrDeleteBlockByUuid(data.value, blockUuid.value) as UtilityBarProps | null;
      const block = blockByUuid || findBlockByName(data.value, 'UtilityBar');
      ensureUtilityBarConfiguration(block, lastKnownConfiguration.value);

      if (block?.configuration) {
        lastKnownConfiguration.value = block.configuration;
      }

      return block;
    },
  );

  const configuration = computed<UtilityBarProps['configuration']>({
    get: () => {
      if (utilityBarBlock.value?.configuration) {
        return utilityBarBlock.value.configuration;
      }

      if (lastKnownConfiguration.value) {
        return lastKnownConfiguration.value;
      }

      return detachedConfiguration.value;
    },
    set: (newConfiguration) => {
      if (utilityBarBlock.value) {
        utilityBarBlock.value.configuration = newConfiguration;
        lastKnownConfiguration.value = newConfiguration;
      } else {
        detachedConfiguration.value = newConfiguration;
      }
    },
  });

  const sections = computed<UtilityBarSection[]>({
    get: () => {
      const order: SectionType[] = configuration.value.sectionOrder?.sections || ['logo', 'search', 'actions'];
      return order.map(
        (id): UtilityBarSection => ({
          id,
          name: `UtilityBar${id.charAt(0).toUpperCase()}${id.slice(1)}`,
          visible: configuration.value.sectionVisibility?.[id] !== false,
        }),
      );
    },
    set: (value: UtilityBarSection[]) => {
      if (!configuration.value.sectionOrder) {
        configuration.value.sectionOrder = { sections: [] };
      }
      configuration.value.sectionOrder.sections = value.map((section) => section.id);

      if (!configuration.value.sectionVisibility) {
        configuration.value.sectionVisibility = { logo: true, search: true, actions: true };
      }

      const sectionVisibility = configuration.value.sectionVisibility;
      value.forEach((section) => {
        sectionVisibility[section.id] = section.visible !== false;
      });
    },
  });

  return {
    utilityBarBlock,
    configuration,
    sections,
  };
};
