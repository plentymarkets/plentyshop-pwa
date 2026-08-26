import { readFile } from 'node:fs/promises';


export type LoadFeatureFlagsDeps = {
  readFile: (path: string, encoding: BufferEncoding) => Promise<string>;
  filePath: string;
  configFlags?: Record<string, unknown>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const loadFeatureFlags = async (deps: LoadFeatureFlagsDeps): Promise<Record<string, unknown>> => {
  try {
    const parsed: unknown = JSON.parse(await deps.readFile(deps.filePath, 'utf-8'));
    if (isRecord(parsed)) return parsed;
  } catch {}
  return deps.configFlags ?? {};
};


export default defineNuxtPlugin({
  name: 'shop-core:feature-flags',
  enforce: 'pre',
  async setup() {
    const runtimeConfig = useRuntimeConfig();
    const flags = useState<Record<string, unknown>>('extensions', () => ({}));
    flags.value = await loadFeatureFlags({
      readFile,
      filePath: '/etc/plenty/extensions',
      configFlags: runtimeConfig.public.shopCore.featureFlags,
    });
    console.log(flags.value);
  },
});
