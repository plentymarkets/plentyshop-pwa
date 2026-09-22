import { relative, dirname, resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import type { NodePlopAPI } from 'plop';
import type { GeneratorAnswers } from '../types/confirmation';
import { pathResolver } from '../core/path/PathResolver';
import type { Operation } from '../types/dry-run';

/**
 * Dry-run utilities for PlentyONE Shop generators
 */

/**
 * Class to handle dry-run functionality
 */
export class DryRunManager {
  public operations: Operation[] = [];
  public isDryRun = false;

  constructor() {
    this.operations = [];
    this.isDryRun = false;
  }

  /**
   * Enable dry-run mode
   */
  enableDryRun() {
    this.isDryRun = true;
    this.operations = [];
  }

  /**
   * Disable dry-run mode
   */
  disableDryRun() {
    this.isDryRun = false;
    this.operations = [];
  }

  /**
   * Log a file operation
   */
  logOperation(type: string, path: string, content = ''): void {
    const relativePath = relative(pathResolver.getProjectRoot(), path);

    this.operations.push({
      type,
      path,
      relativePath,
      content,
      exists: existsSync(path),
      timestamp: new Date(),
    });
  }

  /**
   * Get summary of planned operations
   */
  getSummary() {
    if (this.operations.length === 0) {
      return 'No operations planned.';
    }

    const summary = ['📋 Planned Operations:', ''];

    const creates = this.operations.filter((op) => op.type === 'create');
    const updates = this.operations.filter((op) => op.type === 'update');
    const conflicts = this.operations.filter((op) => op.exists && op.type === 'create');

    if (conflicts.length > 0) {
      summary.push('❌ CONFLICTS DETECTED:');
      conflicts.forEach((op) => {
        summary.push(`   ${op.relativePath} (already exists)`);
      });
      summary.push('');
    }

    if (creates.length > 0) {
      summary.push('✅ Files to create:');
      creates
        .filter((op) => !op.exists)
        .forEach((op) => {
          summary.push(`   ${op.relativePath}`);
        });
      summary.push('');
    }

    if (updates.length > 0) {
      summary.push('📝 Files to update:');
      updates.forEach((op) => {
        summary.push(`   ${op.relativePath}`);
      });
      summary.push('');
    }

    return summary.join('\n');
  }

  /**
   * Check if there are any conflicts
   */
  hasConflicts() {
    return this.operations.some((op) => op.exists && op.type === 'create');
  }

  /**
   * Execute all planned operations (only if not in dry-run mode)
   */
  execute() {
    if (this.isDryRun) {
      throw new Error('Cannot execute operations in dry-run mode');
    }

    try {
      this.operations.forEach((op) => {
        if (op.type === 'create') {
          mkdirSync(dirname(op.path), { recursive: true });
          writeFileSync(op.path, op.content, 'utf8');
        }
      });

      console.log(`✅ Successfully created ${this.operations.length} files`);
    } catch (error) {
      console.error(`❌ Error creating files: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.operations = [];
    }
  }
}

/**
 * Global dry-run manager instance
 */
export const dryRunManager = new DryRunManager();

interface PlopActionConfig {
  path?: string;
  template?: string;
  templateFile?: string;
  [key: string]: unknown;
}

/**
 * Plop action that respects dry-run mode.
 *
 * Only registered under a distinct action type (not `'add'`) and only used when dry-run mode is
 * active — real (non-dry-run) file writes always go through plop's own built-in `add` action, so
 * this never affects normal generation. Path/content resolution mirrors node-plop's own
 * `_common-action-utils.js` (`getDestBasePath`/`getPlopfilePath`) so the preview matches exactly
 * what the real `add` action would do.
 */
export function createDryRunAction(type: string) {
  return function (answers: GeneratorAnswers, config: PlopActionConfig, plop: NodePlopAPI) {
    const destPath = resolve(plop.getDestBasePath(), plop.renderString(config.path ?? '', answers));

    let content = '';
    if (config.templateFile) {
      const absTemplatePath = resolve(plop.getPlopfilePath(), config.templateFile);
      const rawTemplate = readFileSync(absTemplatePath, 'utf8');
      content = plop.renderString(rawTemplate, answers);
    } else if (config.template) {
      content = plop.renderString(config.template, answers);
    }

    // DryRunManager's summary/conflict logic (getSummary/hasConflicts) recognizes the semantic
    // operation kinds 'create'/'update', not plop's action-type names ('add', 'modify', ...).
    const summaryType = type === 'add' ? 'create' : type;
    dryRunManager.logOperation(summaryType, destPath, content);
    const conflictNote = existsSync(destPath) ? ' (already exists — would conflict)' : '';
    return `Planned: ${type} ${destPath}${conflictNote}`;
  };
}
