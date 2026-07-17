import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useEditorItemProperties } from '~/composables/useEditorItemProperties/useEditorItemProperties';
import {
  mockGroup1,
  mockGroup2,
  mockRawGroups,
  mockProperty1,
  mockProperty2,
  mockProperty3,
  mockGetItemProperties,
} from './useEditorItemProperties.mocks';

const mockClipboardWriteText = vi.fn();
const mockNotificationSend = vi.fn();

mockNuxtImport('useI18n', () => () => ({
  locale: ref('en'),
}));

mockNuxtImport('useNotification', () => () => ({
  send: mockNotificationSend,
}));

mockNuxtImport('useSdk', () => () => ({
  plentysystems: {
    getItemProperties: mockGetItemProperties,
  },
}));

mockNuxtImport('onMounted', () => (callback: () => unknown) => callback());

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const initComposable = async () => {
  const composable = useEditorItemProperties();
  await flushPromises();
  return composable;
};

describe('useEditorItemProperties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItemProperties.mockResolvedValue({ data: mockRawGroups });
    vi.stubGlobal('navigator', { clipboard: { writeText: mockClipboardWriteText } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getGroupName', () => {
    it('should return the group name', async () => {
      const { getGroupName, filteredGroups } = await initComposable();
      const firstGroup = filteredGroups.value[0];
      expect(firstGroup).toBeDefined();
      expect(getGroupName(firstGroup!)).toBe('Appearance');
    });
  });

  describe('getPropName', () => {
    it('should return the property name', async () => {
      const { getPropName } = await initComposable();
      expect(getPropName(mockProperty1)).toBe('Color');
    });
    it('should return the fallback missing translation message', async () => {
      const { getPropName } = await initComposable();
      expect(getPropName(mockProperty3)).toBe('Missing translation for id: 30');
    });
  });

  describe('getPropPlaceholder', () => {
    it('should return {{value:id}} with the property id', async () => {
      const { getPropPlaceholder } = await initComposable();
      expect(getPropPlaceholder(mockProperty1)).toBe(`{{value:${mockProperty1.id}}}`);
      expect(getPropPlaceholder(mockProperty2)).toBe(`{{value:${mockProperty2.id}}}`);
    });
  });

  describe('filteredGroups', () => {
    it('should return all groups when search query is empty', async () => {
      const { filteredGroups } = await initComposable();
      expect(filteredGroups.value).toHaveLength(mockRawGroups.length);
    });
    it('should filter properties by name within a group', async () => {
      const { filteredGroups, searchQuery } = await initComposable();
      searchQuery.value = 'color';
      expect(filteredGroups.value).toHaveLength(1);
      expect(filteredGroups.value[0]!.id).toBe(mockGroup1.id);
      expect(filteredGroups.value[0]!.properties).toHaveLength(1);
      expect(filteredGroups.value[0]!.properties[0]!.id).toBe(mockProperty1.id);
    });
    it('should include a group when its name matches even if no properties match', async () => {
      const { filteredGroups, searchQuery } = await initComposable();
      searchQuery.value = 'technical';
      expect(filteredGroups.value).toHaveLength(1);
      expect(filteredGroups.value[0]!.id).toBe(mockGroup2.id);
    });
    it('should return an empty array when no groups match the query', async () => {
      const { filteredGroups, searchQuery } = await initComposable();
      searchQuery.value = 'zzznomatch';
      expect(filteredGroups.value).toHaveLength(0);
    });
  });

  describe('toggleGroup', () => {
    it('should add a group id to openGroups when it is closed', async () => {
      const { openGroups, toggleGroup } = await initComposable();
      openGroups.value = [];
      toggleGroup(mockGroup1.id);
      expect(openGroups.value).toContain(mockGroup1.id);
    });
    it('should remove a group id from openGroups when it is open', async () => {
      const { openGroups, toggleGroup } = await initComposable();
      openGroups.value = [mockGroup1.id];
      toggleGroup(mockGroup1.id);
      expect(openGroups.value).not.toContain(mockGroup1.id);
    });
    it('should keep open groups unchanged when search query is set', async () => {
      const { openGroups, searchQuery } = await initComposable();
      openGroups.value = [mockGroup1.id];
      searchQuery.value = 'color';
      expect(openGroups.value).toEqual([mockGroup1.id]);
    });
  });

  describe('selectionCount', () => {
    it('should return 0 when nothing is selected', async () => {
      const { selectionCount } = await initComposable();
      expect(selectionCount.value).toBe(0);
    });
    it('should count a selected property name as 1', async () => {
      const { selectionCount, selection } = await initComposable();
      selection.value[mockProperty1.id] = { name: true, value: false };
      expect(selectionCount.value).toBe(1);
    });
    it('should count a selected property value as 1', async () => {
      const { selectionCount, selection } = await initComposable();
      selection.value[mockProperty1.id] = { name: false, value: true };
      expect(selectionCount.value).toBe(1);
    });
    it('should count name and value selections independently', async () => {
      const { selectionCount, selection } = await initComposable();
      selection.value[mockProperty1.id] = { name: true, value: true };
      expect(selectionCount.value).toBe(2);
    });
    it('should count a selected group name as 1', async () => {
      const { selectionCount, groupSelection } = await initComposable();
      groupSelection.value[mockGroup1.id] = { name: true };
      expect(selectionCount.value).toBe(1);
    });
    it('should sum property and group selections', async () => {
      const { selectionCount, selection, groupSelection } = await initComposable();
      selection.value[mockProperty1.id] = { name: true, value: true };
      groupSelection.value[mockGroup1.id] = { name: true };
      expect(selectionCount.value).toBe(3);
    });
  });

  describe('toggleSelection', () => {
    it('should initialize a selection entry when none exists and set name to true', async () => {
      const { selection, toggleSelection } = await initComposable();
      toggleSelection(mockProperty1.id, 'name', true);
      expect(selection.value[mockProperty1.id]).toEqual({ name: true, value: false });
    });
    it('should set the value field independently', async () => {
      const { selection, toggleSelection } = await initComposable();
      toggleSelection(mockProperty1.id, 'value', true);
      expect(selection.value[mockProperty1.id]).toEqual({ name: false, value: true });
    });
    it('should update an existing selection entry', async () => {
      const { selection, toggleSelection } = await initComposable();
      selection.value[mockProperty1.id] = { name: true, value: false };
      toggleSelection(mockProperty1.id, 'name', false);
      expect(selection.value[mockProperty1.id]!.name).toBe(false);
    });
  });

  describe('toggleGroupItemSelection', () => {
    it('should initialize a group selection entry and set name to true', async () => {
      const { groupSelection, toggleGroupItemSelection } = await initComposable();
      toggleGroupItemSelection(mockGroup1.id, 'name', true);
      expect(groupSelection.value[mockGroup1.id]).toEqual({ name: true });
    });
    it('should uncheck an existing group selection', async () => {
      const { groupSelection, toggleGroupItemSelection } = await initComposable();
      groupSelection.value[mockGroup1.id] = { name: true };
      toggleGroupItemSelection(mockGroup1.id, 'name', false);
      expect(groupSelection.value[mockGroup1.id]!.name).toBe(false);
    });
  });

  describe('insertSelected', () => {
    it('should return selected property name as a token', async () => {
      const { selection, insertSelected } = await initComposable();
      selection.value[mockProperty1.id] = { name: true, value: false };
      expect(insertSelected()).toEqual([
        {
          token: 'Color',
          label: 'Color',
          kind: 'property-name',
          propertyId: mockProperty1.id,
        },
      ]);
    });
    it('should return a value placeholder token with the property id metadata', async () => {
      const { selection, insertSelected } = await initComposable();
      selection.value[mockProperty1.id] = { name: false, value: true };
      expect(insertSelected()).toEqual([
        {
          token: `{{value:${mockProperty1.id}}}`,
          label: 'Color value',
          kind: 'property-value',
          propertyId: mockProperty1.id,
          cast: mockProperty1.cast,
        },
      ]);
    });
    it('should return the group name before its property tokens', async () => {
      const { selection, groupSelection, insertSelected } = await initComposable();
      groupSelection.value[mockGroup1.id] = { name: true };
      selection.value[mockProperty1.id] = { name: true, value: false };
      expect(insertSelected()).toEqual([
        {
          token: 'Appearance',
          label: 'Appearance',
          kind: 'group-name',
        },
        {
          token: 'Color',
          label: 'Color',
          kind: 'property-name',
          propertyId: mockProperty1.id,
        },
      ]);
    });
    it('should copy the tokens to the clipboard', async () => {
      const { selection, insertSelected } = await initComposable();
      selection.value[mockProperty1.id] = { name: true, value: false };
      insertSelected();
      expect(mockClipboardWriteText).toHaveBeenCalledWith('Color');
    });
    it('should copy the value placeholder label to the clipboard', async () => {
      const { selection, insertSelected } = await initComposable();
      selection.value[mockProperty1.id] = { name: false, value: true };
      insertSelected();
      expect(mockClipboardWriteText).toHaveBeenCalledWith('Color value');
    });
    it('should not write to the clipboard when nothing is selected', async () => {
      const { insertSelected } = await initComposable();
      insertSelected();
      expect(mockClipboardWriteText).not.toHaveBeenCalled();
    });
  });

  describe('fetching', () => {
    it('should fetch item properties from the SDK on mounted', async () => {
      await initComposable();
      expect(mockGetItemProperties).toHaveBeenCalledOnce();
    });

    it('should send a notification when fetching fails', async () => {
      mockGetItemProperties.mockRejectedValueOnce(new Error('Network error'));
      await initComposable();

      expect(mockNotificationSend).toHaveBeenCalledWith({
        message: 'Could not load item properties.',
        type: 'negative',
      });
    });
  });
});
