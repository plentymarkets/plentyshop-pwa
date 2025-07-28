import { dryRunManager } from './dry-run';
import type { GeneratorAnswers, PromptConfig } from '../types/confirmation';

/**
 * User confirmation utilities for PlentyONE Shop generators
 */

/**
 * Prompts for user confirmation with detailed information
 */
export function createConfirmationPrompt(answers: GeneratorAnswers, actionType = 'create'): PromptConfig {
  return {
    type: 'confirm',
    name: 'confirmGeneration',
    message: (answers: GeneratorAnswers) => {
      const summary = buildOperationSummary(answers, actionType);
      return `${summary}\n\nProceed with ${actionType} operation?`;
    },
    default: true,
    when: (answers: GeneratorAnswers) => {
      // Always show confirmation in dry-run mode
      if (dryRunManager.isDryRun) {
        return true;
      }

      // Show confirmation for potentially destructive operations
      return answers.force || hasComplexOperation(answers);
    },
  };
}

/**
 * Creates a dry-run mode prompt
 */
export function createDryRunPrompt(): PromptConfig {
  return {
    type: 'confirm',
    name: 'dryRun',
    message: '🔍 Run in preview mode? (shows what would be created without making changes)',
    default: false,
  };
}

/**
 * Creates a force overwrite prompt
 */
export function createForcePrompt(): PromptConfig {
  return {
    type: 'confirm',
    name: 'force',
    message: '⚠️  Force overwrite existing files?',
    default: false,
    when: (answers: GeneratorAnswers) => {
      // Only show if files would conflict
      return wouldHaveConflicts(answers);
    },
  };
}

/**
 * Builds a summary of what will be created/modified
 */
function buildOperationSummary(answers: GeneratorAnswers, actionType: string): string {
  const lines = [`📋 ${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Summary:`];

  // Add component/generator specific information
  if (answers.name) {
    lines.push(`   Name: ${answers.name}`);
  }

  if (answers.description) {
    lines.push(`   Description: ${answers.description}`);
  }

  if (answers.type) {
    lines.push(`   Type: ${answers.type}`);
  }

  // Add file information if in dry-run mode
  if (dryRunManager.isDryRun) {
    const summary = dryRunManager.getSummary();
    if (summary !== 'No operations planned.') {
      lines.push('');
      lines.push(summary);
    }
  }

  // Add warnings if applicable
  const warnings = buildWarnings(answers);
  if (warnings.length > 0) {
    lines.push('');
    lines.push('⚠️  Warnings:');
    warnings.forEach((warning) => lines.push(`   ${warning}`));
  }

  return lines.join('\n');
}

/**
 * Checks if the operation involves complex or potentially problematic changes
 */
function hasComplexOperation(answers: GeneratorAnswers): boolean {
  // Define what constitutes a "complex" operation
  return !!(answers.force || answers.withTests === false || answers.overwrite || answers.generateMultiple);
}

/**
 * Checks if there would be file conflicts
 */
function wouldHaveConflicts(_answers: GeneratorAnswers): boolean {
  if (dryRunManager.isDryRun) {
    return dryRunManager.hasConflicts();
  }

  // For non-dry-run mode, we'd need to check file existence
  // This would be implemented based on the specific generator type
  return false;
}

/**
 * Builds a list of warnings for the operation
 */
function buildWarnings(answers: GeneratorAnswers): string[] {
  const warnings: string[] = [];

  if (answers.force) {
    warnings.push('Existing files will be overwritten');
  }

  if (answers.withTests === false) {
    warnings.push('Test files will not be generated');
  }

  if (answers.name && answers.name.length > 30) {
    warnings.push('Component name is quite long - consider a shorter name');
  }

  if (answers.description && answers.description.length < 20) {
    warnings.push('Consider adding a more detailed description');
  }

  return warnings;
}

/**
 * Creates a final confirmation prompt for destructive operations
 */
export function createDestructiveConfirmationPrompt(operation: string): PromptConfig {
  return {
    type: 'input',
    name: 'destructiveConfirmation',
    message: `⚠️  This operation will ${operation}. Type "yes" to confirm:`,
    validate: (input: unknown) => {
      if (typeof input !== 'string' || input.toLowerCase() !== 'yes') {
        return 'Please type "yes" to confirm this destructive operation';
      }
      return true;
    },
    when: (answers: GeneratorAnswers) => !!(answers.force && wouldHaveConflicts(answers)),
  };
}

/**
 * Processes confirmation results and sets appropriate flags
 */
export function processConfirmationAnswers(answers: GeneratorAnswers): GeneratorAnswers {
  // Handle dry-run mode
  if (answers.dryRun) {
    dryRunManager.enableDryRun();
    console.log('🔍 Running in preview mode...\n');
  } else {
    dryRunManager.disableDryRun();
  }

  // Handle force mode
  if (answers.force) {
    console.log('⚠️  Force mode enabled - existing files will be overwritten\n');
  }

  // Validate destructive confirmation if needed
  if (answers.destructiveConfirmation && answers.destructiveConfirmation.toLowerCase() !== 'yes') {
    throw new Error('Operation cancelled by user');
  }

  return answers;
}
