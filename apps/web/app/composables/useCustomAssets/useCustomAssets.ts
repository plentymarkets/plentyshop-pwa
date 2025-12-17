import type {
  UseCustomAssetsReturn,
  UseCustomAssetsState,
  SaveCustomAssets,
  SetAssetsInitialData,
  AddOrUpdate,
  GetAssetsOfType,
  SelectAsset,
} from './types';
import type { Asset } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';

/**
 * @description Composable for managing custom assets (CSS, JS, Custom Code).
 * @returns UseCustomAssetsReturn
 * @example
 * ``` ts
 * const { data, loading, addOrUpdate, saveCustomAssets } = useCustomAssets();
 * ```
 */
export const useCustomAssets: UseCustomAssetsReturn = () => {
  const state = useState<UseCustomAssetsState>('customAssets', () => ({
    data: [],
    loading: false,
    initialData: [],
    currentAsset: {} as Asset,
  }));

  const addOrUpdate: AddOrUpdate = async (asset: Asset, selectAsset = true) => {
    const uuidValue = asset.uuid || uuid();
    const existingIndex = state.value.data.findIndex((a) => a.uuid === asset.uuid);

    if (existingIndex !== -1) {
      const updated = {
        ...state.value.data[existingIndex],
        ...asset,
        uuid: uuidValue,
      };

      state.value.data[existingIndex] = updated;

      if (state.value.currentAsset?.uuid === uuidValue) {
        state.value.currentAsset = updated;
      }
    } else {
      const created = {
        ...asset,
        uuid: uuidValue,
      };

      state.value.data.push(created);

      if (selectAsset) {
        state.value.currentAsset = created || ({} as Asset);
      }
    }
  };

  const getAssetsOfType: GetAssetsOfType = (type: string) => {
    const currentAssets = state.value.data || [];
    const initialAssets = Array.isArray(state.value.initialData)
      ? markRaw(JSON.parse(JSON.stringify(state.value.initialData)))
      : [];

    const merged = [...initialAssets, ...currentAssets]
      .filter((asset) => asset.type === type)
      .reduce(
        (acc, asset) => {
          acc[asset.uuid] = asset;
          return acc;
        },
        {} as Record<string, Asset>,
      );

    const assets = Object.values(merged) as Asset[];
    return assets.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  const setInitialData: SetAssetsInitialData = (assets: Asset[]) => {
    state.value.initialData = assets.map((asset) => ({
      ...asset,
      uuid: uuid(),
    }));
  };

  const assetsIsDirty = computed(() => {
    const actualChanges = state.value.data.filter((changedAsset) => {
      const initialAsset = state.value.initialData.find((a) => a.uuid === changedAsset.uuid);
      if (!initialAsset) return true;
      return JSON.stringify(initialAsset) !== JSON.stringify(changedAsset);
    });

    return actualChanges.length > 0;
  });

  const selectAsset: SelectAsset = (asset: Asset) => {
    state.value.currentAsset = asset;
  };

  const deleteAsset = async (asset: Asset) => {
    const uuidValue = asset.uuid;
    const { send } = useNotification();
    const { $i18n } = useNuxtApp();

    if (!asset.id) {
      state.value.data = state.value.data.filter((a) => a.uuid !== uuidValue);
      send({ message: $i18n.t('customAssets.assetDeletedSuccessfully'), type: 'positive' });
    } else {
      try {
        state.value.loading = true;

        await useSdk().plentysystems.deleteCustomAsset({
          id: asset.id,
        });

        state.value.initialData = state.value.initialData.filter((a) => a.uuid !== uuidValue);
        state.value.data = state.value.data.filter((a) => a.uuid !== uuidValue);
        send({ message: $i18n.t('customAssets.assetDeletedSuccessfully'), type: 'positive' });
      } catch (error) {
        send({ message: $i18n.t('customAssets.failedToDeleteAsset'), type: 'negative' });
        throw error;
      } finally {
        state.value.loading = false;
      }
    }

    if (state.value.currentAsset?.uuid === uuidValue) {
      state.value.currentAsset = {} as Asset;
    }
  };

  const saveCustomAssets: SaveCustomAssets = async () => {
    const { send } = useNotification();
    const { $i18n } = useNuxtApp();

    try {
      state.value.loading = true;

      const allAssets = [...state.value.initialData];
      state.value.data.forEach((changedAsset) => {
        const existingIndex = allAssets.findIndex((a) => a.uuid === changedAsset.uuid);
        if (existingIndex !== -1) {
          allAssets[existingIndex] = changedAsset;
        } else {
          allAssets.push(changedAsset);
        }
      });

      const typeNameCombinations = new Map<string, Asset>();
      for (const asset of allAssets) {
        const key = `${asset.type}-${asset.name}`;
        if (typeNameCombinations.has(key)) {
          send({ message: $i18n.t('customAssets.duplicateAssetError'), type: 'negative' });
          state.value.loading = false;
          return false;
        }
        typeNameCombinations.set(key, asset);
      }

      await useSdk().plentysystems.setCustomAssets(state.value.data);

      const merged = [...state.value.initialData];
      state.value.data.forEach((changedAsset) => {
        const existingIndex = merged.findIndex((a) => a.uuid === changedAsset.uuid);
        if (existingIndex !== -1) {
          merged[existingIndex] = changedAsset;
        } else {
          merged.push(changedAsset);
        }
      });
      state.value.initialData = merged;
      state.value.data = [] as Asset[];
    } catch (error) {
      console.error('Error saving custom assets:', error);
    } finally {
      state.value.loading = false;
    }
    return true;
  };

  return {
    assetsIsDirty,
    saveCustomAssets,
    setInitialData,
    getAssetsOfType,
    addOrUpdate,
    selectAsset,
    deleteAsset,
    ...toRefs(state.value),
  };
};
