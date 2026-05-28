import type { ApiGroup, ItemPropertyTranslated } from '~/components/blocks/PriceCard/types';
import type { UseEditorItemPropertiesOptions, UseEditorItemProperties, PropSelection } from './types';

const itemPropertyGroups = ref<ApiGroup[]>([]);

export function useEditorItemProperties(options: UseEditorItemPropertiesOptions = {}): UseEditorItemProperties {
  const { externalGroups, onInsert, onClose } = options;

  const { locale } = useI18n();
  const requestedLocale = computed(() => locale.value || 'en');

  const loading = ref(false);
  const searchQuery = ref('');
  const openGroups = ref<number[]>([]);
  const selection = ref<Record<number, PropSelection>>({});
  const groupSelection = ref<Record<number, { name: boolean }>>({});

  const getGroupName = (group: ApiGroup): string => group.name;
  const getPropName = (prop: ItemPropertyTranslated): string => prop.name;
  const getPropPlaceholder = (_prop: ItemPropertyTranslated): string => '{{value}}';

  const sourceGroups = computed<ApiGroup[]>(() => {
    const externalGroupList = externalGroups?.();
    return externalGroupList?.length ? externalGroupList : itemPropertyGroups.value;
  });

  const filteredGroups = computed<ApiGroup[]>(() => {
    const query = searchQuery.value.toLowerCase().trim();
    if (!query) return sourceGroups.value;
    return sourceGroups.value
      .map((group) => ({
        ...group,
        properties: group.properties.filter(
          (prop) =>
            getPropName(prop).toLowerCase().includes(query) || getPropPlaceholder(prop).toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.properties.length > 0 || getGroupName(group).toLowerCase().includes(query));
  });

  const selectionCount = computed(() => {
    const propCount = Object.values(selection.value).reduce(
      (total, propSel) => total + (propSel.name ? 1 : 0) + (propSel.value ? 1 : 0),
      0,
    );
    const groupCount = Object.values(groupSelection.value).reduce(
      (total, groupSel) => total + (groupSel.name ? 1 : 0),
      0,
    );
    return propCount + groupCount;
  });

  watch(
    () => sourceGroups.value[0]?.id,
    (firstId) => {
      if (firstId !== undefined && openGroups.value.length === 0) openGroups.value = [firstId];
    },
    { immediate: true },
  );

  watch(searchQuery, (query) => {
    if (query) openGroups.value = filteredGroups.value.map((group) => group.id);
  });

  const toggleGroup = (id: number) => {
    const groupIndex = openGroups.value.indexOf(id);
    if (groupIndex === -1) {
      openGroups.value.push(id);
    } else {
      openGroups.value.splice(groupIndex, 1);
    }
  };

  const toggleSelection = (propId: number, field: 'name' | 'value', checked: boolean) => {
    if (!selection.value[propId]) selection.value[propId] = { name: false, value: false };
    selection.value[propId][field] = checked;
  };

  const toggleGroupItemSelection = (groupId: number, field: 'name', checked: boolean) => {
    if (!groupSelection.value[groupId]) groupSelection.value[groupId] = { name: false };
    groupSelection.value[groupId][field] = checked;
  };

  const insertSelected = () => {
    const tokens: string[] = [];

    for (const group of sourceGroups.value) {
      if (groupSelection.value[group.id]?.name) tokens.push(getGroupName(group));
      for (const prop of group.properties) {
        const propSel = selection.value[prop.id];
        if (!propSel) continue;
        if (propSel.name) tokens.push(getPropName(prop));
        if (propSel.value) tokens.push(getPropPlaceholder(prop));
      }
    }

    if (tokens.length === 0) return;

    navigator.clipboard?.writeText(tokens.join(' '));
    onInsert?.(tokens);
    onClose?.();
  };

  const fetchItemProperties = async (fetchLocale = 'en') => {
    loading.value = true;
    try {
      const { data } = await useSdk().plentysystems.getItemProperties({ locale: fetchLocale });
      itemPropertyGroups.value = data;
    } catch (error) {
      throw new Error(`Failed to fetch item properties: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    if (externalGroups?.()?.length) return;
    try {
      await fetchItemProperties(requestedLocale.value);
    } catch {
      useNotification().send({ message: 'Could not load item properties.', type: 'negative' });
    }
  });

  return {
    loading,
    searchQuery,
    openGroups,
    selection,
    groupSelection,
    filteredGroups,
    selectionCount,
    getGroupName,
    getPropName,
    getPropPlaceholder,
    toggleGroup,
    toggleSelection,
    toggleGroupItemSelection,
    insertSelected,
  };
}
