import type { UseUtilityBarActionsOptions } from './types';
import type { SectionType } from '~/components/blocks/UtilityBar/types';

export const useUtilityBarActions = (options: UseUtilityBarActionsOptions) => {
  const { sections, editingSectionIndex, openSectionMenuIndex, getEditorTranslation, emit } = options;

  const sectionLabels = computed(() => ({
    logo: getEditorTranslation('logo-section-label'),
    search: getEditorTranslation('search-section-label'),
    actions: getEditorTranslation('actions-section-label'),
  }));

  const getSectionLabel = (sectionId: SectionType): string => {
    return sectionLabels.value[sectionId] || sectionId;
  };

  const editSection = (index: number): void => {
    if (index < 0 || index >= sections.value.length) {
      return;
    }

    editingSectionIndex.value = index;
    openSectionMenuIndex.value = undefined;

    const sectionId = sections.value[index]?.id;
    if (sectionId) {
      emit('set-edit-title', getSectionLabel(sectionId));
    }
  };

  const exitEditMode = (shouldEmit = true): void => {
    editingSectionIndex.value = undefined;
    openSectionMenuIndex.value = undefined;

    if (shouldEmit) {
      emit('clear-edit-title');
    }
  };

  const toggleSectionMenu = (index: number): void => {
    if (openSectionMenuIndex.value === index) {
      openSectionMenuIndex.value = undefined;
    } else {
      openSectionMenuIndex.value = index;
    }
  };

  const toggleSectionVisibility = (index: number): void => {
    const section = sections.value[index];
    if (!section) {
      return;
    }

    const updatedSections = [...sections.value];
    const sectionToUpdate = updatedSections[index];

    if (!sectionToUpdate) {
      return;
    }

    sectionToUpdate.visible = !sectionToUpdate.visible;
    sections.value = updatedSections;
  };

  return {
    getSectionLabel,
    editSection,
    exitEditMode,
    toggleSectionMenu,
    toggleSectionVisibility,
  };
};
