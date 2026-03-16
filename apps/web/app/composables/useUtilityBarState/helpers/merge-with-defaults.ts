import type { UtilityBarContent, SectionType } from '~/components/blocks/UtilityBar/types';
import { createDefaultContent } from './create-default-content';

export const mergeWithDefaults = (incoming: Partial<UtilityBarContent> | undefined): UtilityBarContent => {
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
