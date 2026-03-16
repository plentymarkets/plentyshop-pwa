import type { UtilityBarSection } from '~/components/blocks/UtilityBar/types';

export type UseUtilityBarActionsOptions = {
  sections: { value: UtilityBarSection[] };
  editingSectionIndex: Ref<number | undefined>;
  openSectionMenuIndex: Ref<number | undefined>;
  getEditorTranslation: (key: string) => string;
  emit: ((event: 'set-edit-title', title: string) => void) & ((event: 'clear-edit-title') => void);
};
