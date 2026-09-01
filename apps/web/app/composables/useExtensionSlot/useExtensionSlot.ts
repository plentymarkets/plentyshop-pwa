import type { Component } from 'vue';
import type { SlotEntry } from './types';

// Module-scope Map stores the actual component objects.
// Not reactive and not in useState — component objects can't be serialized.
// Plugins run on both server and client, so this Map is populated on both sides.
const _componentRegistry = new Map<string, Component>();

export const useExtensionSlot = () => {
  // useState is called inside the composable so it always runs within a Nuxt context.
  // Calling it with the same key every time is intentional — useState deduplicates by key
  // and returns the same shared ref, so the registry persists across the app lifetime.
  const _slots = useState<Record<string, SlotEntry[]>>('extension-slots', () => ({}));

  /**
   * Called by module plugins at app startup to claim a named slot.
   * Pass the component object directly — no global registration via addComponent needed.
   * Deduplicates by componentName so HMR / double-registration is safe.
   *
   * @param slotName      - The slot identifier (e.g. 'homepage-top')
   * @param component     - The imported component object (e.g. `import Foo from './Foo.vue'`)
   * @param componentName - A unique string key for the component (used for dedup + :key)
   * @param extensionId   - The extension's npm package name, used to look up the feature flag
   */
  const register = (slotName: string, component: Component, componentName: string, extensionId: string) => {
    _componentRegistry.set(componentName, component);

    if (!_slots.value[slotName]) {
      _slots.value[slotName] = [];
    }

    const alreadyRegistered = _slots.value[slotName].some((e) => e.componentName === componentName);

    if (!alreadyRegistered) {
      _slots.value[slotName].push({ componentName, extensionId });
    }
  };

  /**
   * Returns a computed list of entries for a slot, filtered to only ENABLED extensions.
   *
   * This computed reads from useState('feature-flags'), which is updated immediately when
   * the toggle writes to flags.json (via the PATCH endpoint). That means disabling an
   * extension makes every slot it registered into disappear reactively — no page refresh.
   *
   * Default behaviour: if the flag key is absent, the extension is considered enabled.
   */
  const getSlotEntries = (slotName: string) => {
    return computed(() => {
      const featureFlags = useState<Record<string, boolean>>('feature-flags', () => ({}));

      return (_slots.value[slotName] ?? []).filter(({ extensionId }) => {
        const flagKey = `extension.${extensionId}.enabled`;
        // Absent key → enabled. Only explicit `false` disables.
        return featureFlags.value[flagKey] !== false;
      });
    });
  };

  /** Resolves the component object for a registered slot entry. */
  const getSlotComponent = (componentName: string): Component | undefined => {
    return _componentRegistry.get(componentName);
  };

  return { register, getSlotEntries, getSlotComponent };
};
