import type { Ref } from 'vue';
import { describe, it, expect, vi } from 'vitest';
import { createSiteSettingsLogic } from '../../createSiteSettingsLogic';
import type { UseSiteSettingsDeps, UseSiteSettingsState } from '../../types';

const noop = () => undefined;

const makeState = (overrides: Partial<UseSiteSettingsState> = {}): Ref<UseSiteSettingsState> =>
  ref({
    data: {},
    loading: false,
    initialData: {},
    ...overrides,
  }) as Ref<UseSiteSettingsState>;

const makeDeps = (overrides: Partial<UseSiteSettingsDeps> = {}): UseSiteSettingsDeps => ({
  sdk: {
    plentysystems: {
      setConfiguration: vi.fn().mockResolvedValue({ data: [] }),
    },
  },
  runtimeConfigPublic: {},
  ...overrides,
});

describe('createSiteSettingsLogic', () => {
  describe('getSetting', () => {
    it('returns an empty string when no setting key was provided', () => {
      const logic = createSiteSettingsLogic(undefined, makeState(), makeDeps());

      expect(logic.getSetting()).toBe('');
    });

    it('returns the value from initialData when data has no override', () => {
      const state = makeState({ initialData: { useAvif: false } });
      const logic = createSiteSettingsLogic('useAvif', state, makeDeps());

      expect(logic.getSetting()).toBe('false');
    });

    it('prefers the value from data over initialData', () => {
      const state = makeState({ data: { useAvif: 'true' }, initialData: { useAvif: false } });
      const logic = createSiteSettingsLogic('useAvif', state, makeDeps());

      expect(logic.getSetting()).toBe('true');
    });

    it('returns an empty string when the setting is not present anywhere', () => {
      const logic = createSiteSettingsLogic('missingKey', makeState(), makeDeps());

      expect(logic.getSetting()).toBe('');
    });
  });

  describe('getBooleanSetting', () => {
    it('returns true for the native boolean true from initialData', () => {
      const state = makeState({ initialData: { enabled: true } });
      const logic = createSiteSettingsLogic('enabled', state, makeDeps());

      expect(logic.getBooleanSetting()).toBe(true);
    });

    it('returns false for the native boolean false from initialData', () => {
      const state = makeState({ initialData: { enabled: false } });
      const logic = createSiteSettingsLogic('enabled', state, makeDeps());

      expect(logic.getBooleanSetting()).toBe(false);
    });

    it('returns true after updateSetting writes the string "true"', () => {
      const state = makeState({ initialData: { enabled: false } });
      const logic = createSiteSettingsLogic('enabled', state, makeDeps());

      logic.updateSetting('true');

      expect(logic.getBooleanSetting()).toBe(true);
    });

    it('returns false after updateSetting writes the string "false" (not the string-truthy bug)', () => {
      const state = makeState({ initialData: { enabled: true } });
      const logic = createSiteSettingsLogic('enabled', state, makeDeps());

      logic.updateSetting('false');

      expect(logic.getBooleanSetting()).toBe(false);
    });
  });

  describe('getNumberSetting', () => {
    it('returns the parsed number when the setting is numeric', () => {
      const state = makeState({ initialData: { categoryId: '42' } });
      const logic = createSiteSettingsLogic('categoryId', state, makeDeps());

      expect(logic.getNumberSetting()).toBe(42);
    });

    it('returns the default fallback of 0 when the setting is empty', () => {
      const logic = createSiteSettingsLogic('categoryId', makeState(), makeDeps());

      expect(logic.getNumberSetting()).toBe(0);
    });

    it('returns the provided fallback when the setting is empty', () => {
      const logic = createSiteSettingsLogic('itemCanonicalId', makeState(), makeDeps());

      expect(logic.getNumberSetting(-1)).toBe(-1);
    });

    it('returns the fallback when the setting is not a valid number', () => {
      const state = makeState({ initialData: { categoryId: 'not-a-number' } });
      const logic = createSiteSettingsLogic('categoryId', state, makeDeps());

      expect(logic.getNumberSetting(7)).toBe(7);
    });

    it('returns 0 as the actual value rather than falling back when the setting is legitimately 0', () => {
      const state = makeState({ initialData: { passwordMinLength: 0 } });
      const logic = createSiteSettingsLogic('passwordMinLength', state, makeDeps());

      expect(logic.getNumberSetting(8)).toBe(0);
    });
  });

  describe('getJsonSetting', () => {
    it('returns an empty array when no setting key was provided', () => {
      const logic = createSiteSettingsLogic(undefined, makeState(), makeDeps());

      expect(logic.getJsonSetting()).toEqual([]);
    });

    it('parses the default value from initialData', () => {
      const state = makeState({ initialData: { availableSortingOptions: ['a', 'b'] } });
      const logic = createSiteSettingsLogic('availableSortingOptions', state, makeDeps());

      expect(logic.getJsonSetting()).toEqual(['a', 'b']);
    });

    it('parses the overridden value from data', () => {
      const state = makeState({
        data: { availableSortingOptions: JSON.stringify(['c']) },
        initialData: { availableSortingOptions: ['a', 'b'] },
      });
      const logic = createSiteSettingsLogic('availableSortingOptions', state, makeDeps());

      expect(logic.getJsonSetting()).toEqual(['c']);
    });
  });

  describe('updateSetting', () => {
    it('writes the value into state.data under the setting key', () => {
      const state = makeState();
      const logic = createSiteSettingsLogic('useAvif', state, makeDeps());

      logic.updateSetting('true');

      expect(state.value.data.useAvif).toBe('true');
    });

    it('does nothing when no setting key was provided', () => {
      const state = makeState();
      const logic = createSiteSettingsLogic(undefined, state, makeDeps());

      logic.updateSetting('true');

      expect(state.value.data).toEqual({});
    });
  });

  describe('setInitialData', () => {
    it('parses JSON-encoded string values from the API', () => {
      const state = makeState();
      const logic = createSiteSettingsLogic('useAvif', state, makeDeps());

      logic.setInitialData([{ key: 'useAvif', originalKey: 'useAvif', value: 'true' }]);

      expect(state.value.initialData.useAvif).toBe(true);
    });

    it('keeps non-JSON string values as-is', () => {
      const state = makeState();
      const logic = createSiteSettingsLogic('storename', state, makeDeps());

      logic.setInitialData([{ key: 'storename', originalKey: 'storename', value: 'PlentyONE GmbH' }]);

      expect(state.value.initialData.storename).toBe('PlentyONE GmbH');
    });

    it('merges the runtime config defaults with the fetched settings', () => {
      const state = makeState();
      const deps = makeDeps({ runtimeConfigPublic: { useWebp: true } });
      const logic = createSiteSettingsLogic('useAvif', state, deps);

      logic.setInitialData([{ key: 'useAvif', originalKey: 'useAvif', value: 'true' }]);

      expect(state.value.initialData).toEqual({ useWebp: true, useAvif: true });
    });
  });

  describe('settingsIsDirty / dirtyKeys', () => {
    it('is not dirty when data has no overrides', () => {
      const state = makeState({ initialData: { useAvif: false } });
      const logic = createSiteSettingsLogic('useAvif', state, makeDeps());

      expect(logic.settingsIsDirty.value).toBe(false);
      expect(logic.dirtyKeys.value).toEqual([]);
    });

    it('is dirty when data differs from initialData', () => {
      const state = makeState({ data: { useAvif: 'true' }, initialData: { useAvif: false } });
      const logic = createSiteSettingsLogic('useAvif', state, makeDeps());

      expect(logic.settingsIsDirty.value).toBe(true);
      expect(logic.dirtyKeys.value).toEqual(['useAvif']);
    });

    it('is not dirty when the changed value matches the initial value', () => {
      const state = makeState({ data: { useAvif: false }, initialData: { useAvif: false } });
      const logic = createSiteSettingsLogic('useAvif', state, makeDeps());

      expect(logic.settingsIsDirty.value).toBe(false);
    });
  });

  describe('saveSiteSettings', () => {
    it('sends stringified settings to the SDK and merges data into initialData on success', async () => {
      const setConfiguration = vi.fn().mockResolvedValue({ data: [] });
      const state = makeState({ data: { useAvif: 'true' }, initialData: { useAvif: false } });
      const deps = makeDeps({ sdk: { plentysystems: { setConfiguration } } });
      const logic = createSiteSettingsLogic('useAvif', state, deps);

      const result = await logic.saveSiteSettings();

      expect(setConfiguration).toHaveBeenCalledWith({ settings: [{ key: 'useAvif', value: 'true' }] });
      expect(state.value.initialData.useAvif).toBe('true');
      expect(result).toBe(true);
    });

    it('sets loading to false after the call settles', async () => {
      const state = makeState({ data: { useAvif: 'true' } });
      const logic = createSiteSettingsLogic('useAvif', state, makeDeps());

      await logic.saveSiteSettings();

      expect(state.value.loading).toBe(false);
    });

    it('logs the error, keeps loading false, and still resolves true on failure', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(noop);
      const setConfiguration = vi.fn().mockRejectedValue(new Error('network error'));
      const state = makeState({ data: { useAvif: 'true' } });
      const deps = makeDeps({ sdk: { plentysystems: { setConfiguration } } });
      const logic = createSiteSettingsLogic('useAvif', state, deps);

      const result = await logic.saveSiteSettings();

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(state.value.loading).toBe(false);
      expect(result).toBe(true);

      consoleErrorSpy.mockRestore();
    });

    it('JSON-stringifies non-string values before sending them to the SDK', async () => {
      const setConfiguration = vi.fn().mockResolvedValue({ data: [] });
      const state = makeState({ data: { defaultB2BClassIds: ['1', '2'] } });
      const deps = makeDeps({ sdk: { plentysystems: { setConfiguration } } });
      const logic = createSiteSettingsLogic('defaultB2BClassIds', state, deps);

      await logic.saveSiteSettings();

      expect(setConfiguration).toHaveBeenCalledWith({
        settings: [{ key: 'defaultB2BClassIds', value: JSON.stringify(['1', '2']) }],
      });
    });
  });
});
