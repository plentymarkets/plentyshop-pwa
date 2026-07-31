import type { ApiGroup, ItemPropertyTranslated } from '~/components/blocks/PriceCard/types';
import type { PropertyPlaceholderToken } from '~/composables/useRichTextEditor/types';
import type {
  UseEditorItemProperties,
  PropSelection,
  ItemPropertyLocaleMap,
  ItemProperty,
  ItemPropertyGroup,
} from './types';

const FALLBACK_LOCALE = 'en';

const resolveLocaleValue = (map: ItemPropertyLocaleMap, locale: string, fallback: string): string => {
  if (map[locale] != null) return map[locale] as string;
  if (map[FALLBACK_LOCALE] != null) return map[FALLBACK_LOCALE] as string;
  return fallback;
};

const translateGroup = (group: ItemPropertyGroup, locale: string): ApiGroup => ({
  id: group.id,
  position: group.position,
  name: resolveLocaleValue(group.names, locale, `Missing translation for id: ${group.id}`),
  description: resolveLocaleValue(group.descriptions, locale, ''),
  properties: group.properties.map(
    (p: ItemProperty): ItemPropertyTranslated => ({
      id: p.id,
      cast: p.cast,
      name: resolveLocaleValue(p.names, locale, `Missing translation for id: ${p.id}`),
      description: resolveLocaleValue(p.descriptions, locale, ''),
    }),
  ),
});

const itemPropertyGroups = ref<ApiGroup[]>([]);

export function useEditorItemProperties(): UseEditorItemProperties {
  const { locale } = useI18n();
  const requestedLocale = computed(() => locale.value || 'en');

  const loading = ref(false);
  const searchQuery = ref('');
  const openGroups = ref<number[]>([]);
  const selection = ref<Record<number, PropSelection>>({});
  const groupSelection = ref<Record<number, { name: boolean }>>({});

  const getGroupName = (group: ApiGroup): string => group.name;
  const getPropName = (prop: ItemPropertyTranslated): string => prop.name;
  const getPropPlaceholder = (prop: ItemPropertyTranslated): string => `{{value:${prop.id}}}`;

  const sourceGroups = computed<ApiGroup[]>(() => itemPropertyGroups.value);

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

  const insertSelected = (): PropertyPlaceholderToken[] => {
    const tokens: PropertyPlaceholderToken[] = [];

    for (const group of sourceGroups.value) {
      if (groupSelection.value[group.id]?.name) {
        tokens.push({
          token: getGroupName(group),
          label: getGroupName(group),
          kind: 'group-name',
        });
      }

      for (const prop of group.properties) {
        const propSel = selection.value[prop.id];
        if (!propSel) continue;

        if (propSel.name) {
          tokens.push({
            token: getPropName(prop),
            label: getPropName(prop),
            kind: 'property-name',
            propertyId: prop.id,
          });
        }

        if (propSel.value) {
          tokens.push({
            token: `{{value:${prop.id}}}`,
            label: `${getPropName(prop)} value`,
            kind: 'property-value',
            propertyId: prop.id,
            cast: prop.cast,
          });
        }
      }
    }

    if (tokens.length > 0) {
      navigator.clipboard?.writeText(tokens.map(({ label }) => label).join(' '));
    }

    return tokens;
  };

  const fetchItemProperties = async () => {
    loading.value = true;
    try {
      const { data } = await useSdk().plentysystems.getItemProperties();
      itemPropertyGroups.value = data.map((g) => translateGroup(g, requestedLocale.value));
    } catch (error) {
      throw new Error(`Failed to fetch item properties: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    try {
      await fetchItemProperties();
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
