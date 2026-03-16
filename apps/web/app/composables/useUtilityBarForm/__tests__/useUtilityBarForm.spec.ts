import { describe, expect, it } from 'vitest';
import type { UtilityBarSection } from '~/components/blocks/UtilityBar/types';

import { useUtilityBarForm } from '../useUtilityBarForm';

describe('useUtilityBarForm', () => {
  const baseSections: UtilityBarSection[] = [
    { id: 'logo', name: 'UtilityBarLogo', visible: true },
    { id: 'search', name: 'UtilityBarSearch', visible: true },
    { id: 'actions', name: 'UtilityBarActions', visible: true },
  ];

  it('should initialize with default UI state', () => {
    const sections = computed(() => baseSections);
    const form = useUtilityBarForm(sections);

    expect(form.elementsOpen.value).toBe(true);
    expect(form.layoutOpen.value).toBe(true);
    expect(form.editingSectionIndex.value).toBeUndefined();
    expect(form.openSectionMenuIndex.value).toBeUndefined();
    expect(form.currentEditingSectionIndex.value).toBeUndefined();
    expect(form.sectionForm.value).toBeNull();
  });

  it('should keep currentEditingSectionIndex in sync with editingSectionIndex', () => {
    const sections = computed(() => baseSections);
    const form = useUtilityBarForm(sections);

    form.editingSectionIndex.value = 1;

    expect(form.currentEditingSectionIndex.value).toBe(1);
  });

  it('should resolve an async component when selected section form exists', () => {
    const sections = computed(() => baseSections);
    const form = useUtilityBarForm(sections);

    form.editingSectionIndex.value = 0;

    expect(form.sectionForm.value).toBeTruthy();
  });

  it('should return null when selected index is out of bounds', () => {
    const sections = computed(() => baseSections);
    const form = useUtilityBarForm(sections);

    form.editingSectionIndex.value = 99;

    expect(form.sectionForm.value).toBeNull();
  });

  it('should return null when selected section has no matching form file', () => {
    const sections = computed<UtilityBarSection[]>(() => [{ id: 'logo', name: 'UtilityBarUnknown', visible: true }]);
    const form = useUtilityBarForm(sections);

    form.editingSectionIndex.value = 0;

    expect(form.sectionForm.value).toBeNull();
  });
});
