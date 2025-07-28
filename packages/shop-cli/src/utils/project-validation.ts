import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ValidationResult } from '../types/project-validation';

/**
 * Project structure validation utilities for PlentyONE Shop generators
 */

/**
 * Validates that we're running from within a PlentyONE Shop PWA project
 */
export function validateProjectStructure(basePath = process.cwd()): ValidationResult {
  const errors: string[] = [];

  // Check for key project files/directories
  const requiredPaths = [
    'apps/web/nuxt.config.ts',
    'apps/server/middleware.config.ts',
    'turbo.json',
    'package.json',
    'apps/web/components',
    'apps/web/composables',
    'apps/web/pages',
  ];

  for (const path of requiredPaths) {
    const fullPath = join(basePath, path);
    if (!existsSync(fullPath)) {
      errors.push(`Missing required path: ${path}`);
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      message:
        'This does not appear to be a valid PlentyONE Shop PWA project.\n' +
        'Please ensure you are running this generator from within the project root.',
    };
  }

  return { valid: true, errors: [] };
}

export function validateComponentDirectory(componentPath: string): ValidationResult {
  const errors: string[] = [];

  if (!existsSync(componentPath)) {
    return { valid: true, message: 'Component directory does not exist (will be created)' };
  }

  // Check for existing files that might conflict
  const componentName = componentPath.split('/').pop();
  const potentialFiles: string[] = [
    join(componentPath, `${componentName}.vue`),
    join(componentPath, 'index.ts'),
    join(componentPath, 'types.ts'),
  ];

  const existingFiles: string[] = potentialFiles.filter(existsSync);

  if (existingFiles.length > 0) {
    errors.push(...existingFiles.map((file) => `File already exists: ${file}`));
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      message: 'Component files already exist. Use --force to overwrite or choose a different name.',
    };
  }

  return { valid: true };
}

export function validateWebAppStructure(webAppPath: string): ValidationResult {
  const errors: string[] = [];

  const requiredDirs: string[] = ['components', 'composables', 'pages', 'utils', 'types'];

  for (const dir of requiredDirs) {
    const dirPath = join(webAppPath, dir);
    if (!existsSync(dirPath)) {
      errors.push(`Missing directory: ${dir}`);
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      message: 'Web app structure is incomplete. Some required directories are missing.',
    };
  }

  return { valid: true, errors: [] };
}

/**
 * Gets suggestions for fixing project structure issues
 */
export function getProjectStructureSuggestions(errors: string[]): string[] {
  const suggestions: string[] = [];

  if (errors.some((e: string) => e.includes('apps/web'))) {
    suggestions.push('• Ensure you are in the project root directory');
    suggestions.push('• Check that the PlentyONE Shop PWA is properly set up');
  }

  if (errors.some((e: string) => e.includes('turbo.json'))) {
    suggestions.push('• This should be a Turborepo project');
    suggestions.push('• Verify the monorepo structure is intact');
  }

  if (errors.some((e: string) => e.includes('components'))) {
    suggestions.push('• Components directory might need to be created');
    suggestions.push('• Check that the Nuxt.js app is properly initialized');
  }

  return suggestions;
}
