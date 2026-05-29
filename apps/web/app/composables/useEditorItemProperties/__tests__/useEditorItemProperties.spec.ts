import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useEditorItemProperties } from '~/composables/useEditorItemProperties/useEditorItemProperties';
import {
  mockGroup1,
  mockGroup2,
  mockGroups,
  mockProperty1,
  mockProperty2,
  mockProperty3,
  mockGetItemProperties,
} from './useEditorItemProperties.mocks';

const mockClipboardWriteText = vi.fn();

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
}));

mockNuxtImport('useNotification', () => () => ({
  send: vi.fn(),
}));

mockNuxtImport('useSdk', () => () => ({
  plentysystems: {
    getItemProperties: mockGetItemProperties,
  },
}));

mockNuxtImport('onMounted', () => vi.fn());

describe('useEditorItemProperties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('navigator', { clipboard: { writeText: mockClipboardWriteText } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getGroupName', () => {
    it('should return the group name', () => {
      const { getGroupName } = useEditorItemProperties({ externalGroups: () => mockGroups });
      expect(getGroupName(mockGroup1)).toBe('Appearance');
    });
  });

  describe('getPropName', () => {
    it('should return the property name', () => {
      const { getPropName } = useEditorItemProperties({ externalGroups: () => mockGroups });
      expect(getPropName(mockProperty1)).toBe('Color');
    });
    it('should return the fallback missing translation message', () => {
      const { getPropName } = useEditorItemProperties({ externalGroups: () => mockGroups });
      expect(getPropName(mockProperty3)).toBe('Missing translation for id: 30');
    });
  });

  describe('getPropPlaceholder', () => {
    it('should return {{value}} for any property', () => {
      const { getPropPlaceholder } = useEditorItemProperties({ externalGroups: () => mockGroups });
      expect(getPropPlaceholder(mockProperty1)).toBe('{{value}}');
      expect(getPropPlaceholder(mockProperty2)).toBe('{{value}}');
    });
  });

  describe('filteredGroups', () => {
    it('should return all groups when search query is empty', () => {
      const { filteredGroups } = useEditorItemProperties({ externalGroups: () => mockGroups });
      expect(filteredGroups.value).toHaveLength(mockGroups.length);
    });
    it('should filter properties by name within a group', () => {
      const { filteredGroups, searchQuery } = useEditorItemProperties({ externalGroups: () => mockGroups });
      searchQuery.value = 'color';
      expect(filteredGroups.value).toHaveLength(1);
      expect(filteredGroups.value[0]!.id).toBe(mockGroup1.id);
      expect(filteredGroups.value[0]!.properties).toHaveLength(1);
      expect(filteredGroups.value[0]!.properties[0]!.id).toBe(mockProperty1.id);
    });
    it('should include a group when its name matches even if no properties match', () => {
      const { filteredGroups, searchQuery } = useEditorItemProperties({ externalGroups: () => mockGroups });
      searchQuery.value = 'technical';
      expect(filteredGroups.value).toHaveLength(1);
      expect(filteredGroups.value[0]!.id).toBe(mockGroup2.id);
    });
    it('should return an empty array when no groups match the query', () => {
      const { filteredGroups, searchQuery } = useEditorItemProperties({ externalGroups: () => mockGroups });
      searchQuery.value = 'zzznomatch';
      expect(filteredGroups.value).toHaveLength(0);
    });
  });

  describe('toggleGroup', () => {
    it('should add a group id to openGroups when it is closed', () => {
      const { openGroups, toggleGroup } = useEditorItemProperties({ externalGroups: () => mockGroups });
      openGroups.value = [];
      toggleGroup(mockGroup1.id);
      expect(openGroups.value).toContain(mockGroup1.id);
    });
    it('should remove a group id from openGroups when it is open', () => {
      const { openGroups, toggleGroup } = useEditorItemProperties({ externalGroups: () => mockGroups });
      openGroups.value = [mockGroup1.id];
      toggleGroup(mockGroup1.id);
      expect(openGroups.value).not.toContain(mockGroup1.id);
    });
    it('should expand all matching groups when search query is set', async () => {
      const { openGroups, searchQuery } = useEditorItemProperties({ externalGroups: () => mockGroups });
      openGroups.value = [];
      searchQuery.value = 'color';
      await nextTick();
      expect(openGroups.value.length).toBeGreaterThan(0);
    });
  });

  describe('selectionCount', () => {
    it('should return 0 when nothing is selected', () => {
      const { selectionCount } = useEditorItemProperties({ externalGroups: () => mockGroups });
      expect(selectionCount.value).toBe(0);
    });
    it('should count a selected property name as 1', () => {
      const { selectionCount, selection } = useEditorItemProperties({ externalGroups: () => mockGroups });
      selection.value[mockProperty1.id] = { name: true, value: false };
      expect(selectionCount.value).toBe(1);
    });
    it('should count a selected property value as 1', () => {
      const { selectionCount, selection } = useEditorItemProperties({ externalGroups: () => mockGroups });
      selection.value[mockProperty1.id] = { name: false, value: true };
      expect(selectionCount.value).toBe(1);
    });
    it('should count name and value selections independently', () => {
      const { selectionCount, selection } = useEditorItemProperties({ externalGroups: () => mockGroups });
      selection.value[mockProperty1.id] = { name: true, value: true };
      expect(selectionCount.value).toBe(2);
    });
    it('should count a selected group name as 1', () => {
      const { selectionCount, groupSelection } = useEditorItemProperties({ externalGroups: () => mockGroups });
      groupSelection.value[mockGroup1.id] = { name: true };
      expect(selectionCount.value).toBe(1);
    });
    it('should sum property and group selections', () => {
      const { selectionCount, selection, groupSelection } = useEditorItemProperties({
        externalGroups: () => mockGroups,
      });
      selection.value[mockProperty1.id] = { name: true, value: true };
      groupSelection.value[mockGroup1.id] = { name: true };
      expect(selectionCount.value).toBe(3);
    });
  });

  describe('toggleSelection', () => {
    it('should initialize a selection entry when none exists and set name to true', () => {
      const { selection, toggleSelection } = useEditorItemProperties({ externalGroups: () => mockGroups });
      toggleSelection(mockProperty1.id, 'name', true);
      expect(selection.value[mockProperty1.id]).toEqual({ name: true, value: false });
    });
    it('should set the value field independently', () => {
      const { selection, toggleSelection } = useEditorItemProperties({ externalGroups: () => mockGroups });
      toggleSelection(mockProperty1.id, 'value', true);
      expect(selection.value[mockProperty1.id]).toEqual({ name: false, value: true });
    });
    it('should update an existing selection entry', () => {
      const { selection, toggleSelection } = useEditorItemProperties({ externalGroups: () => mockGroups });
      selection.value[mockProperty1.id] = { name: true, value: false };
      toggleSelection(mockProperty1.id, 'name', false);
      expect(selection.value[mockProperty1.id]!.name).toBe(false);
    });
  });

  describe('toggleGroupItemSelection', () => {
    it('should initialize a group selection entry and set name to true', () => {
      const { groupSelection, toggleGroupItemSelection } = useEditorItemProperties({
        externalGroups: () => mockGroups,
      });
      toggleGroupItemSelection(mockGroup1.id, 'name', true);
      expect(groupSelection.value[mockGroup1.id]).toEqual({ name: true });
    });
    it('should uncheck an existing group selection', () => {
      const { groupSelection, toggleGroupItemSelection } = useEditorItemProperties({
        externalGroups: () => mockGroups,
      });
      groupSelection.value[mockGroup1.id] = { name: true };
      toggleGroupItemSelection(mockGroup1.id, 'name', false);
      expect(groupSelection.value[mockGroup1.id]!.name).toBe(false);
    });
  });

  describe('insertSelected', () => {
    it('should not call onInsert when nothing is selected', () => {
      const onInsert = vi.fn();
      const { insertSelected } = useEditorItemProperties({ externalGroups: () => mockGroups, onInsert });
      insertSelected();
      expect(onInsert).not.toHaveBeenCalled();
    });
    it('should emit the selected property name as a token', () => {
      const onInsert = vi.fn();
      const { selection, insertSelected } = useEditorItemProperties({
        externalGroups: () => mockGroups,
        onInsert,
      });
      selection.value[mockProperty1.id] = { name: true, value: false };
      insertSelected();
      expect(onInsert).toHaveBeenCalledWith(['Color']);
    });
    it('should emit the {{value}} placeholder as a token', () => {
      const onInsert = vi.fn();
      const { selection, insertSelected } = useEditorItemProperties({
        externalGroups: () => mockGroups,
        onInsert,
      });
      selection.value[mockProperty1.id] = { name: false, value: true };
      insertSelected();
      expect(onInsert).toHaveBeenCalledWith(['{{value}}']);
    });
    it('should emit the group name before its property tokens', () => {
      const onInsert = vi.fn();
      const { selection, groupSelection, insertSelected } = useEditorItemProperties({
        externalGroups: () => mockGroups,
        onInsert,
      });
      groupSelection.value[mockGroup1.id] = { name: true };
      selection.value[mockProperty1.id] = { name: true, value: false };
      insertSelected();
      expect(onInsert).toHaveBeenCalledWith(['Appearance', 'Color']);
    });
    it('should copy the tokens to the clipboard', () => {
      const { selection, insertSelected } = useEditorItemProperties({ externalGroups: () => mockGroups });
      selection.value[mockProperty1.id] = { name: true, value: false };
      insertSelected();
      expect(mockClipboardWriteText).toHaveBeenCalledWith('Color');
    });
    it('should not write to the clipboard when nothing is selected', () => {
      const { insertSelected } = useEditorItemProperties({ externalGroups: () => mockGroups });
      insertSelected();
      expect(mockClipboardWriteText).not.toHaveBeenCalled();
    });
    it('should call onClose after a successful insert', () => {
      const onInsert = vi.fn();
      const onClose = vi.fn();
      const { selection, insertSelected } = useEditorItemProperties({
        externalGroups: () => mockGroups,
        onInsert,
        onClose,
      });
      selection.value[mockProperty1.id] = { name: true, value: false };
      insertSelected();
      expect(onClose).toHaveBeenCalledOnce();
    });
    it('should not call onClose when nothing is selected', () => {
      const onClose = vi.fn();
      const { insertSelected } = useEditorItemProperties({ externalGroups: () => mockGroups, onClose });
      insertSelected();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('externalGroups', () => {
    it('should use external groups when provided', () => {
      const { filteredGroups } = useEditorItemProperties({ externalGroups: () => mockGroups });
      expect(filteredGroups.value).toHaveLength(mockGroups.length);
    });
    it('should not trigger an SDK fetch when externalGroups is provided', () => {
      useEditorItemProperties({ externalGroups: () => mockGroups });
      expect(mockGetItemProperties).not.toHaveBeenCalled();
    });
  });

});

