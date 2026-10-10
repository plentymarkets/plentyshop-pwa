export interface ModuleManifestEntry {
  id: string;
  entry: string;
  version?: string;
  enabled?: boolean;
  settings?: Record<string, unknown>;
  privateSettings?: Record<string, unknown>;
}

export interface UseModuleManifest {
  modules: Ref<ModuleManifestEntry[]>;
  loading: Ref<boolean>;
  fetchModules: () => Promise<void>;
  toggleModule: (id: string, enabled: boolean) => Promise<void>;
}

export type UseModuleManifestReturn = () => UseModuleManifest;
