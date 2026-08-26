import type { ModuleManifestEntry, UseModuleManifestReturn } from './types';

const modules = ref<ModuleManifestEntry[]>([]);
const loading = ref(false);

export const useModuleManifest: UseModuleManifestReturn = () => {
  const fetchModules = async () => {
    loading.value = true;

    try {
      modules.value = await $fetch<ModuleManifestEntry[]>('/_shop/modules');
    } catch (error) {
      useHandleError(error);
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

      const index = modules.value.findIndex((m) => m.id === id);

      if (index !== -1) {
        modules.value[index] = updated;
      }
    } catch (error) {
      useHandleError(error);
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
