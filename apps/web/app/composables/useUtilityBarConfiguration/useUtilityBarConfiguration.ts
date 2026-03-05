import type { UtilityBarProps, SectionType, UtilityBarSection } from '~/components/blocks/UtilityBar/types';

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

  const utilityBarBlock = computed<UtilityBarProps>(
    () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as UtilityBarProps,
  );

  const configuration = computed<UtilityBarProps['configuration']>({
    get: () => utilityBarBlock.value.configuration || ({} as UtilityBarProps['configuration']),
    set: (value) => {
      if (utilityBarBlock.value) {
        utilityBarBlock.value.configuration = value;
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
      value.forEach((section) => {
        configuration.value.sectionVisibility![section.id] = section.visible !== false;
      });
    },
  });

  return {
    utilityBarBlock,
    configuration,
    sections,
  };
};
