import type { ModuleManifestEntry, UseModuleManifestReturn } from './types';
import type { NuxtError } from '#app';
const modules = ref<ModuleManifestEntry[]>([]);
const loading = ref(false);

export const useModuleManifest: UseModuleManifestReturn = () => {
  const fetchModules = async () => {
    loading.value = true;

    try {
      modules.value = await $fetch<ModuleManifestEntry[]>('/_shop/modules');
    } catch (error) {
      useHandleError(error as NuxtError<unknown> | null);
    } finally {
      loading.value = false;
    }
  };

  const toggleModule = async (id: string, enabled: boolean) => {
    loading.value = true;

    try {
      const updated = await $fetch<ModuleManifestEntry>('/_shop/modules', {
        method: 'PATCH',
        body: { id, enabled },
      });

      const index = modules.value.findIndex((module) => module.id === id);

      if (index !== -1) {
        modules.value[index] = updated;
      }

      const featureFlags = useState<Record<string, boolean>>('feature-flags', () => ({}));
      featureFlags.value = { ...featureFlags.value, [`extension.${id}.enabled`]: enabled };
    } catch (error) {
      useHandleError(error as NuxtError<unknown> | null);
    } finally {
      loading.value = false;
    }
  };

  return {
    modules,
    loading,
    fetchModules,
    toggleModule,
  };
};
