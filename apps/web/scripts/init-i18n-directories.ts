import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function initI18nDirectories() {
  console.warn('[init-i18n] Creating translation directories...');

  const langDir = join(__dirname, '../i18n/lang');

  try {
    await mkdir(langDir, { recursive: true });
    console.warn(`[init-i18n] ✓ Created directory: ${langDir}`);
    console.warn('[init-i18n] ✓ Translation directories initialized successfully');
  } catch (error) {
    console.error('[init-i18n] Failed to initialize i18n directories:', error);
    process.exit(1);
  }
}

initI18nDirectories();
