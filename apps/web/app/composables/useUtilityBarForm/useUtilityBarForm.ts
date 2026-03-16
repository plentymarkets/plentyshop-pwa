import type { UtilityBarSection } from '~/components/blocks/UtilityBar/types';

/**
 * Manages all UI state for the UtilityBarForm component.
 * Handles accordion open/close states, section editing, and async form loading.
 */
export const useUtilityBarForm = (sections: ComputedRef<UtilityBarSection[]>) => {
  const elementsOpen = ref(true);
  const layoutOpen = ref(true);

  const editingSectionIndex = ref<number | undefined>(undefined);
  const openSectionMenuIndex = ref<number | undefined>(undefined);

  const currentEditingSectionIndex = computed(() => editingSectionIndex.value);

  const sectionForms = import.meta.glob('@/components/**/blocks/UtilityBar/forms/**Form.vue') as Record<
    string,
    () => Promise<{ default: unknown }>
  >;

  const sectionForm = computed(() => {
    if (editingSectionIndex.value === undefined) return null;

    const section = sections.value[editingSectionIndex.value];
    if (!section) return null;

    const key = Object.keys(sectionForms).find((path) => path.endsWith(`/${section.name}Form.vue`));
    const loader = key ? sectionForms[key] : undefined;
    return loader ? defineAsyncComponent(loader) : null;
  });

  return {
    elementsOpen,
    layoutOpen,
    editingSectionIndex,
    openSectionMenuIndex,
    currentEditingSectionIndex,
    sectionForm,
  };
};
