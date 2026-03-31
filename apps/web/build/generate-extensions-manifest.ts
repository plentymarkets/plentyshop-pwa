import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ExtensionEntry {
  id: string;
  entry: string;
  version?: string;
  priority?: number;
  settings?: Record<string, unknown>;
}

// TODO: In the future this will fetch from a PlentyONE API endpoint.
// The API will return the list of extensions the merchant has active,
// including their settings (API keys, toggles, etc.).
// Something like:
//
// async function fetchExtensionsFromApi(url: string): Promise<ExtensionEntry[]> {
//   const response = await fetch(url);
//   if (!response.ok) throw new Error(`Failed to fetch extensions: ${response.statusText}`);
//   return response.json();
// }
//
// Usage:
// const apiUrl = process.env.EXTENSIONS_API_URL;
// if (apiUrl) extensions = await fetchExtensionsFromApi(apiUrl);

const DUMMY_EXTENSIONS: ExtensionEntry[] = [
  {
    id: 'mollie',
    entry: '@plentymarkets/shop-module-mollie',
    version: '^1.5.0',
    priority: 10,
    settings: {},
  },
  {
    id: 'charts',
    entry: 'nuxt-charts',
    version: '^2.1.4',
    priority: 20,
    settings: {},
  },
];

async function main() {
  const extensions: ExtensionEntry[] = DUMMY_EXTENSIONS;

  const outputPath = resolve(__dirname, '../extensions-manifest.json');
  writeFileSync(outputPath, JSON.stringify(extensions, null, 2) + '\n');
  console.log(`[generate-extensions-manifest] Written ${extensions.length} extension(s) to extensions-manifest.json`);
}

main().catch((err) => {
  console.error('[generate-extensions-manifest] Fatal error:', err);
  process.exit(1);
});
