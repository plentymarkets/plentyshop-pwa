/**
 * Initialize shop-core translation overrides directory
 * Creates empty override files for active languages to prevent build errors
 * This runs before the build to ensure shop-core i18n module can register locales
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function initShopCoreOverrides() {
  const activeLanguages = (process.env.LANGUAGELIST || 'en,de').split(',').map((lang) => lang.trim());
  const overridesDir = join(__dirname, '../../../node_modules/@plentymarkets/shop-core/dist/runtime/lang/overrides');

  try {
    await mkdir(overridesDir, { recursive: true });

    for (const lang of activeLanguages) {
      const filePath = join(overridesDir, `${lang}.json`);
      await writeFile(filePath, JSON.stringify({ translated: {} }, null, 2));
    }
  } catch {
    process.exit(1);
  }
}

initShopCoreOverrides();
