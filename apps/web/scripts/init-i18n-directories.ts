import { mkdir, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function initI18nDirectories() {
  console.warn('[init-i18n] Initializing translation directories...');

  const langDir = join(__dirname, '../i18n/lang');

  try {
    try {
      const files = await readdir(langDir);
      const translationFiles = files.filter((f) => f.endsWith('.json') || f.endsWith('.ts'));

      if (translationFiles.length > 0) {
        console.warn(`[init-i18n] Clearing ${translationFiles.length} old translation file(s)...`);
        await Promise.all(translationFiles.map((file) => rm(join(langDir, file), { force: true })));
      }
    } catch {
      console.error(`[init-i18n] ✓ Directory does not exist: ${langDir}`);
    }

    await mkdir(langDir, { recursive: true });
    console.warn(`[init-i18n] ✓ Directory ready: ${langDir}`);
    console.warn('[init-i18n] ✓ Translation directories initialized successfully');
  } catch (error) {
    console.error('[init-i18n] Failed to initialize i18n directories:', error);
    process.exit(1);
  }
}

initI18nDirectories();
