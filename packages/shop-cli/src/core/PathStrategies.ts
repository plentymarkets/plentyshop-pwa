/**
 * Path strategies for different generator types
 */

import { join } from 'node:path';
import type { PathOptions, PathResult, PathStrategy, PathConfig } from '../types/path-resolver';

/**
 * Base strategy for path resolution
 */
abstract class BasePathStrategy implements PathStrategy {
  constructor(protected readonly config: PathConfig) {}

  abstract resolve(name: string, options?: PathOptions): PathResult;

  /**
   * Get relative path from packages/shop-cli to target location
   */
  protected getRelativePath(absolutePath: string): string {
    return join('../../apps/web', absolutePath.replace(this.config.webAppRoot, ''));
  }

  /**
   * Build standard file structure result
   */
  protected buildFileStructure(
    basePath: string,
    name: string,
    options: {
      mainFileExtension: string;
      mainFileName?: string;
      includeTypes?: boolean;
      includeIndex?: boolean;
      includeTests?: boolean;
      testFileName?: string;
    },
  ): PathResult {
    const {
      mainFileExtension,
      mainFileName = name,
      includeTypes = true,
      includeIndex = false,
      includeTests = true,
      testFileName = name,
    } = options;

    const relativePath = this.getRelativePath(basePath);
    const mainFile = `${relativePath}/${mainFileName}.${mainFileExtension}`;

    const result: PathResult = {
      basePath: relativePath,
      mainFile,
      files: [mainFile],
    };

    if (includeTypes) {
      const typesFile = `${relativePath}/types.ts`;
      result.typesFile = typesFile;
      result.files.push(typesFile);
    }

    if (includeIndex) {
      const indexFile = `${relativePath}/index.ts`;
      result.indexFile = indexFile;
      result.files.push(indexFile);
    }

    if (includeTests) {
      const testFile = `${relativePath}/__tests__/${testFileName}.spec.ts`;
      result.testFile = testFile;
      result.files.push(testFile);
    }

    return result;
  }
}

/**
 * Component path strategy
 */
export class ComponentPathStrategy extends BasePathStrategy {
  resolve(name: string, options: PathOptions = {}): PathResult {
    const basePath = join(this.config.webAppRoot, 'components', name);
    const mainFileName = options.fileName || `{{pascalCase name}}`;
    const extension = options.extension || 'vue';

    return this.buildFileStructure(basePath, name, {
      mainFileExtension: extension,
      mainFileName,
      includeTypes: true,
      includeIndex: false,
      includeTests: true,
      testFileName: '{{pascalCase name}}',
    });
  }
}

/**
 * UI Component path strategy
 */
export class UIComponentPathStrategy extends BasePathStrategy {
  resolve(name: string, options: PathOptions = {}): PathResult {
    const basePath = join(this.config.webAppRoot, 'components/ui', name);
    const mainFileName = options.fileName || `{{pascalCase name}}`;
    const extension = options.extension || 'vue';

    return this.buildFileStructure(basePath, name, {
      mainFileExtension: extension,
      mainFileName,
      includeTypes: true,
      includeIndex: false,
      includeTests: true,
      testFileName: '{{pascalCase name}}',
    });
  }
}

/**
 * Composable path strategy
 */
export class ComposablePathStrategy extends BasePathStrategy {
  resolve(name: string, options: PathOptions = {}): PathResult {
    const basePath = join(this.config.webAppRoot, 'composables', name);
    const mainFileName = options.fileName || `{{name}}`;
    const extension = options.extension || 'ts';

    return this.buildFileStructure(basePath, name, {
      mainFileExtension: extension,
      mainFileName,
      includeTypes: true,
      includeIndex: true,
      includeTests: true,
      testFileName: '{{name}}',
    });
  }
}

/**
 * Settings component path strategy
 */
export class SettingsPathStrategy extends BasePathStrategy {
  resolve(name: string, options: PathOptions = {}): PathResult {
    const { category = 'general' } = options;
    const basePath = join(this.config.webAppRoot, 'components/settings', category, name);
    const mainFileName = options.fileName || `{{pascalCase name}}`;
    const extension = options.extension || 'vue';

    const result = this.buildFileStructure(basePath, name, {
      mainFileExtension: extension,
      mainFileName,
      includeTypes: true,
      includeIndex: false,
      includeTests: true,
      testFileName: '{{pascalCase name}}',
    });

    // Add toolbar trigger for settings
    const relativePath = this.getRelativePath(basePath);
    const triggerFile = `${relativePath}/ToolbarTrigger.vue`;
    result.triggerFile = triggerFile;
    result.files.push(triggerFile);

    return result;
  }
}

/**
 * Page path strategy
 */
export class PagePathStrategy extends BasePathStrategy {
  resolve(name: string, options: PathOptions = {}): PathResult {
    const { isDynamic = false } = options;
    const fileName = isDynamic ? `[${name}]` : name;
    const basePath = join(this.config.webAppRoot, 'pages');
    const relativePath = this.getRelativePath(basePath);
    const mainFile = `${relativePath}/${fileName}.vue`;

    return {
      basePath: relativePath,
      mainFile,
      files: [mainFile],
    };
  }
}

/**
 * Block component path strategy
 */
export class BlockPathStrategy extends BasePathStrategy {
  resolve(name: string, options: PathOptions = {}): PathResult {
    const basePath = join(this.config.webAppRoot, 'components/blocks', name);
    const mainFileName = options.fileName || `{{pascalCase name}}`;

    const result = this.buildFileStructure(basePath, name, {
      mainFileExtension: 'vue',
      mainFileName,
      includeTypes: true,
      includeIndex: false,
      includeTests: true,
      testFileName: '{{pascalCase name}}',
    });

    // Add form component for blocks
    const relativePath = this.getRelativePath(basePath);
    const formFile = `${relativePath}/{{pascalCase name}}Form.vue`;
    result.formFile = formFile;
    result.files.push(formFile);

    return result;
  }
}
