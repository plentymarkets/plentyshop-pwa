import { relative, dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import type { NodePlopAPI } from 'plop';
import type { GeneratorAnswers } from '../types/confirmation';
import { getProjectBasePath } from './paths';
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
    const relativePath = relative(getProjectBasePath(), path);

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
          // Ensure directory exists
          mkdirSync(dirname(op.path), { recursive: true });
          // Write file
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
  path: string;
  template?: string;
  templateFile?: string;
  [key: string]: unknown;
}

/**
 * Plop action that respects dry-run mode
 */
export function createDryRunAction(type: string) {
  return function (answers: GeneratorAnswers, config: PlopActionConfig, plop: NodePlopAPI) {
    const path = plop.renderString(config.path, answers);
    const template = config.template || config.templateFile;
    let content = '';

    if (template) {
      if (config.templateFile) {
        content = plop.renderString(plop.getHelper('fileContents')(config.templateFile), answers);
      } else {
        content = plop.renderString(template, answers);
      }
    }

    if (dryRunManager.isDryRun) {
      dryRunManager.logOperation(type, path, content);
      return `Planned: ${type} ${path}`;
    }

    // Normal plop action execution
    if (type === 'add') {
      if (existsSync(path)) {
        throw new Error(`File already exists: ${path}`);
      }
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content, 'utf8');
      return `Created: ${path}`;
    }

    return `Unknown action type: ${type}`;
  };
}
