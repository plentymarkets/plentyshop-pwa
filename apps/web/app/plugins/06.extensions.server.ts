import { readFile } from 'node:fs/promises';

export type LoadFeatureFlagsDeps = {
  readFile: (path: string, encoding: BufferEncoding) => Promise<string>;
  filePath: string;
  configFlags?: Record<string, unknown>;
};

const parseDotenv = (content: string): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();

    if (rawValue === 'true') result[key] = true;
    else if (rawValue === 'false') result[key] = false;
    else result[key] = rawValue;
  }
  return result;
};

export const loadExtensions = async (deps: LoadFeatureFlagsDeps): Promise<Record<string, unknown>> => {
  try {
    const parsed = parseDotenv(await deps.readFile(deps.filePath, 'utf-8'));
    if (Object.keys(parsed).length > 0) return parsed;
  } catch { }
  return deps.configFlags ?? {};
};


export default defineNuxtPlugin({
  name: 'extensions',
  parallel: true,
  async setup() {
    const extensions = useState('extensions-state');
    if (import.meta.server) {
     extensions.value = await loadExtensions({
        readFile,
        filePath: '/etc/plenty/extensions/extensions.env',
        configFlags: {}
      });
      console.log('extensions', extensions);
    }

    return {
      provide: { extensions }
    }
  },
});
