import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

interface ManifestEntry {
  id: string;
  enabled?: boolean;
}

const getManifest = (): ManifestEntry[] => {
  const path = resolve(process.cwd(), 'module.manifest.json');

  if (!existsSync(path)) {
    return [];
  }

  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as ManifestEntry[];
  } catch {
    return [];
  }
};

export default defineEventHandler((event) => {
  const requestPath = getRequestURL(event).pathname;

  if (requestPath.startsWith('/_shop/') || requestPath.startsWith('/api/')) {
    return;
  }

  for (const entry of getManifest()) {
    if (entry.enabled !== false) {
      continue;
    }
  }
});
