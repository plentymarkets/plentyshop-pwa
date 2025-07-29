/**
 * Composable testing helper functions
 * Utilities specifically for composable generation and validation testing
 */

import { readFile } from 'fs/promises';
import { TestDirectory } from './directory-helpers';

export async function createComposableStructure(
  testDir: TestDirectory,
  composableName: string,
  expectedFiles: string[],
): Promise<void> {
  const composableDir = `composables/${composableName}`;

  for (const file of expectedFiles) {
    const filePath = `${composableDir}/${file}`;
    const content = generateMockComposableFileContent(file, composableName);
    await testDir.createFile(filePath, content);
  }
}

export async function validateComposableFiles(
  testDir: TestDirectory,
  composableName: string,
  expectedFiles: string[],
): Promise<{ filePath: string; content: string }[]> {
  const results = [];
  for (const file of expectedFiles) {
    const filePath = testDir.getPath(`composables/${composableName}/${file}`);
    const content = await readFile(filePath, 'utf-8');
    results.push({ filePath, content });
  }
  return results;
}

export async function createTypedComposable(testDir: TestDirectory, composableName: string): Promise<void> {
  const files = {
    [`${composableName}.ts`]: `import { ref, computed } from 'vue';
import type { UserDataReturn } from './types';

export const ${composableName} = (): UserDataReturn => {
  const user = ref(null);
  const isLoading = ref(false);

  const isLoggedIn = computed(() => !!user.value);

  return {
    user,
    isLoading,
    isLoggedIn,
  };
};`,

    'types.ts': `export interface UserDataReturn {
  user: Ref<unknown>;
  isLoading: Ref<boolean>;
  isLoggedIn: ComputedRef<boolean>;
}`,
  };

  for (const [fileName, content] of Object.entries(files)) {
    await testDir.createFile(`composables/${composableName}/${fileName}`, content);
  }
}

export async function validateTypedComposable(
  testDir: TestDirectory,
  composableName: string,
): Promise<{
  fileContent: string;
  hasVueImport: boolean;
  hasExportConstant: boolean;
  hasTypeImport: boolean;
}> {
  const composableFile = testDir.getPath(`composables/${composableName}/${composableName}.ts`);
  const fileContent = await readFile(composableFile, 'utf-8');

  return {
    fileContent,
    hasVueImport: fileContent.includes("import { ref, computed } from 'vue'"),
    hasExportConstant: fileContent.includes(`export const ${composableName} = ()`),
    hasTypeImport: fileContent.includes('import type {'),
  };
}

export async function createNamingTestComposable(testDir: TestDirectory, composableName: string): Promise<void> {
  const content = `export const ${composableName} = () => {
  // Implementation
};`;

  await testDir.createFile(`composables/${composableName}/${composableName}.ts`, content);
}

export async function validateComposableNaming(
  testDir: TestDirectory,
  composableName: string,
): Promise<{
  fileContent: string;
  hasExportConstant: boolean;
  followsNamingConvention: boolean;
}> {
  const composableFile = testDir.getPath(`composables/${composableName}/${composableName}.ts`);
  const fileContent = await readFile(composableFile, 'utf-8');

  return {
    fileContent,
    hasExportConstant: fileContent.includes(`export const ${composableName} = ()`),
    followsNamingConvention: /^use[A-Z]/.test(composableName),
  };
}

export function generateMockComposableFileContent(fileName: string, composableName: string): string {
  switch (fileName) {
    case 'index.ts':
      return `export { ${composableName} } from './${composableName}';
// Generated for ${composableName}`;

    case `${composableName}.ts`:
      return `import { ref } from 'vue';
import type { ${composableName.charAt(3).toUpperCase()}${composableName.slice(4)}Return } from './types';

export const ${composableName} = () => {
  // Composable implementation for ${composableName}
  const data = ref(null);
  
  return {
    data,
  };
};`;

    case 'types.ts':
      return `import type { Ref } from 'vue';

export interface ${composableName.charAt(3).toUpperCase()}${composableName.slice(4)}Return {
  data: Ref<unknown>;
}

// Generated types for ${composableName}`;

    case `__tests__/${composableName}.spec.ts`:
      return `import { describe, it, expect } from 'vitest';
import { ${composableName} } from '../${composableName}';

describe('${composableName}', () => {
  it('should work correctly', () => {
    // Test implementation for ${composableName}
    expect(true).toBe(true);
  });
});`;

    default:
      return `// Generated file: ${fileName} for ${composableName}`;
  }
}
