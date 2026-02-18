import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';

describe('composables index exports', () => {
  const dir = path.resolve(__dirname, '..');
  const indexPath = path.join(dir, 'index.ts');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  const exportedModules = Array.from(indexContent.matchAll(/export \* from '\.\/(.*?)';/g)).map((match) => match[1]);

  // Editor composables are intentionally excluded from barrel export to avoid unused JavaScript
  const editorComposablesBlacklist = [
    'useBlockManager',
    'useBlocksList',
    'useCategoryManagement',
    'useCategoriesSearch',
    'useCategorySettings',
    'useCategorySettingsCollection',
    'useDrawerState',
    'useEditor',
    'useEditorUnsavedChangesGuard',
    'useJsonEditor',
    'useToolbar',
    'useUpdatePageTemplate',
    'useAddPage',
    'useBlockContentHelper',
    'useEditModeNotification',
    'useFullWidthToggle',
    'useRichTextEditor',
    'useHtmlEditorMode',
  ];

  const allFileModules = fs
    .readdirSync(dir)
    .filter((file) => /^use.*$/.test(file))
    .map((file) => file.replace(/\.ts$/, ''));

  const fileModules = allFileModules.filter((module) => !editorComposablesBlacklist.includes(module));
  fileModules.push('defaults');

  it('should export every use* composable file except editor composables', () => {
    expect(exportedModules.sort()).toEqual(fileModules.sort());
  });
});
