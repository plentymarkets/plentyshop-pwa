/**
 * Integration tests for --dry-run wiring: createDryRunAction against a real filesystem,
 * driven through a minimal fake plop API (getDestBasePath/getPlopfilePath/renderString).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync } from 'fs';
import type { NodePlopAPI } from 'plop';
import { TestDirectory } from '../utils';
import { dryRunManager, createDryRunAction } from '../../src/utils/dry-run';

const renderString = (template: string, data: Record<string, unknown>): string =>
  template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => String(data[key] ?? ''));

describe('--dry-run wiring', () => {
  let testDir: TestDirectory;
  let plopfileDir: string;
  let destDir: string;

  beforeEach(async () => {
    testDir = new TestDirectory('shop-cli-dry-run-test');
    await testDir.create();
    plopfileDir = testDir.getPath('cli-root');
    destDir = testDir.getPath('dest');
    await testDir.createFile('cli-root/templates/component/component.vue.hbs', '<template>{{name}}</template>');

    dryRunManager.enableDryRun();
  });

  afterEach(async () => {
    dryRunManager.disableDryRun();
    await testDir.cleanup();
  });

  const fakePlop = {
    getDestBasePath: () => destDir,
    getPlopfilePath: () => plopfileDir,
    renderString,
  } as unknown as NodePlopAPI;

  it('should log the operation and write nothing to disk for a new file', () => {
    const addAction = createDryRunAction('add');
    const result = addAction(
      { name: 'TestComponent' },
      { path: '{{name}}/{{name}}.vue', templateFile: 'templates/component/component.vue.hbs' },
      fakePlop,
    );

    const expectedPath = `${destDir}/TestComponent/TestComponent.vue`;
    expect(result).toContain('Planned: add');
    expect(result).not.toContain('already exists');
    expect(existsSync(expectedPath)).toBe(false);
    expect(dryRunManager.operations).toHaveLength(1);
    expect(dryRunManager.operations[0]).toMatchObject({ type: 'create', exists: false });
    expect(dryRunManager.hasConflicts()).toBe(false);
  });

  it('should flag a conflict for a file that already exists, and still write nothing', async () => {
    const existingRelative = 'dest/Existing/Existing.vue';
    await testDir.createFile(existingRelative, '<template>already here</template>');
    const existingPath = testDir.getPath(existingRelative);

    const addAction = createDryRunAction('add');
    const result = addAction(
      { name: 'Existing' },
      { path: '{{name}}/{{name}}.vue', templateFile: 'templates/component/component.vue.hbs' },
      fakePlop,
    );

    expect(result).toContain('already exists');
    expect(dryRunManager.hasConflicts()).toBe(true);

    const contentAfter = await import('fs/promises').then((fs) => fs.readFile(existingPath, 'utf-8'));
    expect(contentAfter).toBe('<template>already here</template>');

    const summary = dryRunManager.getSummary();
    expect(summary).toContain('CONFLICTS DETECTED');
    expect(summary).toContain('Existing/Existing.vue');
  });
});
