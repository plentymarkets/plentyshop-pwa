import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import {
  validateProjectStructure,
  validateComponentDirectory,
  validateWebAppStructure,
  getProjectStructureSuggestions,
} from '../src/utils/project-validation';

describe('Project Validation Utilities', () => {
  const testDir = join(process.cwd(), '__test-project');

  beforeEach(() => {
    // Clean up any existing test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('validateProjectStructure', () => {
    it('should validate a complete project structure', () => {
      // Create a mock project structure
      const requiredPaths = [
        'apps/web',
        'apps/server',
        'apps/web/components',
        'apps/web/composables',
        'apps/web/pages',
      ];

      requiredPaths.forEach((path) => {
        mkdirSync(join(testDir, path), { recursive: true });
      });

      // Create required files
      writeFileSync(join(testDir, 'apps/web/nuxt.config.ts'), 'export default {}');
      writeFileSync(join(testDir, 'apps/server/middleware.config.ts'), 'export default {}');
      writeFileSync(join(testDir, 'turbo.json'), '{}');
      writeFileSync(join(testDir, 'package.json'), '{}');

      const result = validateProjectStructure(testDir);
      expect(result.valid).toBe(true);
    });

    it('should detect missing project structure', () => {
      // Create incomplete structure
      mkdirSync(testDir, { recursive: true });

      const result = validateProjectStructure(testDir);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required path: apps/web/nuxt.config.ts');
      expect(result.message).toContain('PlentyONE Shop PWA project');
    });

    it('should handle non-existent directory', () => {
      const result = validateProjectStructure('/non/existent/path');
      expect(result.valid).toBe(false);
      expect(result.errors?.length).toBeGreaterThan(0);
    });
  });

  describe('validateComponentDirectory', () => {
    it('should allow creation of new component', () => {
      const componentPath = join(testDir, 'NewComponent');

      const result = validateComponentDirectory(componentPath);
      expect(result.valid).toBe(true);
      expect(result.message).toContain('will be created');
    });

    it('should detect existing component files', () => {
      const componentPath = join(testDir, 'ExistingComponent');
      mkdirSync(componentPath, { recursive: true });

      // Create conflicting files
      writeFileSync(join(componentPath, 'ExistingComponent.vue'), '<template></template>');
      writeFileSync(join(componentPath, 'index.ts'), 'export default {}');

      const result = validateComponentDirectory(componentPath);
      expect(result.valid).toBe(false);
      expect(result.errors?.length).toBeGreaterThan(0);
      expect(result.errors?.[0]).toContain('File already exists');
      expect(result.message).toContain('--force to overwrite');
    });
  });

  describe('validateWebAppStructure', () => {
    it('should validate complete web app structure', () => {
      const webAppPath = join(testDir, 'apps/web');

      const requiredDirs = ['components', 'composables', 'pages', 'utils', 'types'];
      requiredDirs.forEach((dir) => {
        mkdirSync(join(webAppPath, dir), { recursive: true });
      });

      const result = validateWebAppStructure(webAppPath);
      expect(result.valid).toBe(true);
    });

    it('should detect missing directories', () => {
      const webAppPath = join(testDir, 'apps/web');
      mkdirSync(webAppPath, { recursive: true });

      const result = validateWebAppStructure(webAppPath);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing directory: components');
      expect(result.message).toContain('incomplete');
    });
  });

  describe('getProjectStructureSuggestions', () => {
    it('should provide suggestions for web app issues', () => {
      const errors = ['Missing required path: apps/web/nuxt.config.ts'];
      const suggestions = getProjectStructureSuggestions(errors);

      expect(suggestions).toContain('• Ensure you are in the project root directory');
      expect(suggestions).toContain('• Check that the PlentyONE Shop PWA is properly set up');
    });

    it('should provide suggestions for turbo issues', () => {
      const errors = ['Missing required path: turbo.json'];
      const suggestions = getProjectStructureSuggestions(errors);

      expect(suggestions).toContain('• This should be a Turborepo project');
      expect(suggestions).toContain('• Verify the monorepo structure is intact');
    });

    it('should provide suggestions for components issues', () => {
      const errors = ['Missing directory: components'];
      const suggestions = getProjectStructureSuggestions(errors);

      expect(suggestions).toContain('• Components directory might need to be created');
      expect(suggestions).toContain('• Check that the Nuxt.js app is properly initialized');
    });

    it('should handle empty errors array', () => {
      const suggestions = getProjectStructureSuggestions([]);
      expect(suggestions).toEqual([]);
    });
  });
});
