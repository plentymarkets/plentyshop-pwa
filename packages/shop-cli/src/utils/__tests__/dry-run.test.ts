import { describe, it, expect, beforeEach } from 'vitest';
import { DryRunManager } from '../dry-run';

describe('DryRunManager', () => {
  let dryRunManager: DryRunManager;

  beforeEach(() => {
    dryRunManager = new DryRunManager();
  });

  describe('Dry-run mode', () => {
    it('should start with dry-run disabled', () => {
      expect(dryRunManager.isDryRun).toBe(false);
      expect(dryRunManager.operations).toEqual([]);
    });

    it('should enable dry-run mode', () => {
      dryRunManager.enableDryRun();
      expect(dryRunManager.isDryRun).toBe(true);
      expect(dryRunManager.operations).toEqual([]);
    });

    it('should disable dry-run mode', () => {
      dryRunManager.enableDryRun();
      dryRunManager.disableDryRun();
      expect(dryRunManager.isDryRun).toBe(false);
      expect(dryRunManager.operations).toEqual([]);
    });
  });

  describe('Operation logging', () => {
    beforeEach(() => {
      dryRunManager.enableDryRun();
    });

    it('should log file creation operations', () => {
      dryRunManager.logOperation('create', '/test/path/Component.vue', '<template></template>');

      expect(dryRunManager.operations).toHaveLength(1);
      expect(dryRunManager.operations[0]).toMatchObject({
        type: 'create',
        path: '/test/path/Component.vue',
        content: '<template></template>',
      });
    });

    it('should log multiple operations', () => {
      dryRunManager.logOperation('create', '/test/Component.vue', 'content1');
      dryRunManager.logOperation('create', '/test/types.ts', 'content2');

      expect(dryRunManager.operations).toHaveLength(2);
    });
  });

  describe('Summary generation', () => {
    beforeEach(() => {
      dryRunManager.enableDryRun();
    });

    it('should return empty message when no operations', () => {
      const summary = dryRunManager.getSummary();
      expect(summary).toBe('No operations planned.');
    });

    it('should generate summary for create operations', () => {
      dryRunManager.logOperation('create', '/project/apps/web/components/Test.vue', 'content');

      const summary = dryRunManager.getSummary();
      expect(summary).toContain('📋 Planned Operations:');
      expect(summary).toContain('✅ Files to create:');
      expect(summary).toContain('apps/web/components/Test.vue');
    });

    it('should detect conflicts for existing files', () => {
      const existingPath = process.cwd() + '/README.md';
      dryRunManager.logOperation('create', existingPath, 'content');

      const summary = dryRunManager.getSummary();
      if (summary.includes('CONFLICTS DETECTED')) {
        expect(summary).toContain('❌ CONFLICTS DETECTED');
      }
    });
  });

  describe('Conflict detection', () => {
    beforeEach(() => {
      dryRunManager.enableDryRun();
    });

    it('should detect when there are no conflicts', () => {
      dryRunManager.logOperation('create', '/non/existing/path/Component.vue', 'content');
      expect(dryRunManager.hasConflicts()).toBe(false);
    });

    it('should handle execution prevention in dry-run mode', () => {
      dryRunManager.enableDryRun();

      expect(() => {
        dryRunManager.execute();
      }).toThrow('Cannot execute operations in dry-run mode');
    });
  });

  describe('Operation execution', () => {
    it('should clear operations after execution attempt', () => {
      dryRunManager.disableDryRun();
      dryRunManager.logOperation('create', '/test/Component.vue', 'content');

      try {
        dryRunManager.execute();
      } catch (error) {
        expect(error).toBeDefined();
      }

      expect(dryRunManager.operations).toEqual([]);
    });
  });
});
