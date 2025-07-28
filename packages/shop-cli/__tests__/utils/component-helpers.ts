/**
 * Component testing helper functions
 * Utilities specifically for component generation and validation testing
 */

import { readFile } from 'fs/promises';
import { TestDirectory } from './directory-helpers';

export async function createComponentStructure(
  testDir: TestDirectory, 
  componentName: string, 
  expectedFiles: string[]
): Promise<void> {
  const componentDir = `components/${componentName}`;
  
  for (const file of expectedFiles) {
    const filePath = `${componentDir}/${file}`;
    const content = generateMockComponentFileContent(file, componentName);
    await testDir.createFile(filePath, content);
  }
}

export async function validateComponentStructure(
  testDir: TestDirectory,
  componentName: string,
  expectedFiles: string[]
): Promise<{ filePath: string; content: string; hasContent: boolean; containsComponentName: boolean }[]> {
  const results = [];
  
  for (const file of expectedFiles) {
    const filePath = testDir.getPath(`components/${componentName}/${file}`);
    const content = await readFile(filePath, 'utf-8');
    
    results.push({
      filePath,
      content,
      hasContent: content.length > 0,
      containsComponentName: content.includes(componentName)
    });
  }
  
  return results;
}

export async function createTypedComponent(testDir: TestDirectory, componentName: string): Promise<void> {
  const files = {
    'index.vue': `
<template>
  <div class="${componentName.toLowerCase()}">
    {{ props.title }}
  </div>
</template>

<script setup lang="ts">
import type { ${componentName}Props } from './types';

const props = defineProps<${componentName}Props>();
</script>
    `.trim(),
    
    'types.ts': `
export interface ${componentName}Props {
  title: string;
}
    `.trim(),
  };

  for (const [fileName, content] of Object.entries(files)) {
    await testDir.createFile(`components/${componentName}/${fileName}`, content);
  }
}

export async function validateTypedComponent(testDir: TestDirectory, componentName: string): Promise<{
  vueContent: string;
  typesContent: string;
  hasImport: boolean;
  hasDefineProps: boolean;
  hasInterface: boolean;
}> {
  const vueFile = testDir.getPath(`components/${componentName}/index.vue`);
  const typesFile = testDir.getPath(`components/${componentName}/types.ts`);
  
  const vueContent = await readFile(vueFile, 'utf-8');
  const typesContent = await readFile(typesFile, 'utf-8');
  
  return {
    vueContent,
    typesContent,
    hasImport: vueContent.includes(`import type { ${componentName}Props }`),
    hasDefineProps: vueContent.includes(`defineProps<${componentName}Props>()`),
    hasInterface: typesContent.includes(`export interface ${componentName}Props`)
  };
}

export async function createNamingTestComponent(
  testDir: TestDirectory,
  input: string,
  expected: string
): Promise<void> {
  const content = `// Component: ${expected} (from input: ${input})`;
  await testDir.createFile(`components/${expected}/index.vue`, content);
}

export async function validateNamingConvention(
  testDir: TestDirectory,
  input: string,
  expected: string
): Promise<{ content: string; containsExpected: boolean; containsInput: boolean }> {
  const filePath = testDir.getPath(`components/${expected}/index.vue`);
  const content = await readFile(filePath, 'utf-8');
  
  return {
    content,
    containsExpected: content.includes(expected),
    containsInput: content.includes(input)
  };
}

export function generateMockComponentFileContent(fileName: string, componentName: string): string {
  switch (fileName) {
    case 'index.vue':
      return `
<template>
  <div class="${componentName.toLowerCase()}">
    <!-- ${componentName} content -->
  </div>
</template>

<script setup lang="ts">
// ${componentName} component logic
</script>
      `.trim();
      
    case 'types.ts':
      return `
export interface ${componentName}Props {
  // Props for ${componentName}
}
      `.trim();
      
    case '__tests__/index.test.ts':
      return `
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

describe('${componentName}', () => {
  it('should render correctly', () => {
    // Test implementation
    expect(true).toBe(true);
  });
});
      `.trim();
      
    default:
      return `// Generated file: ${fileName} for ${componentName}`;
  }
}
