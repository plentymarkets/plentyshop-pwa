/**
 * Path Resolution System for PlentyONE Shop Generators
 *
 * Provides unified path resolution with strategy pattern to replace
 * scattered path logic across template-utils.ts, paths.ts, and ActionBuilder.
 */

import { join, resolve } from 'node:path';
import type { PathOptions, PathResult, PathStrategy, PathConfig } from './types';
import {
  ComponentPathStrategy,
  ComposablePathStrategy,
  SettingsPathStrategy,
  PagePathStrategy,
  BlockPathStrategy,
} from './PathStrategies';

/**
 * Default path configuration
 */
class DefaultPathConfig implements PathConfig {
  get projectRoot(): string {
    // When run from packages/shop-cli, go up two levels to reach project root
    return resolve(process.cwd(), '../../');
  }

  get webAppRoot(): string {
    return join(this.projectRoot, 'apps/web');
  }

  get templatesRoot(): string {
    return join(process.cwd(), 'templates');
  }
}

/**
 * Main path resolver with strategy pattern
 */
export class PathResolver {
  private readonly strategies = new Map<string, PathStrategy>();
  private readonly config: PathConfig;

  constructor(configOverrides?: Partial<PathConfig>) {
    const defaultConfig = new DefaultPathConfig();
    this.config = configOverrides
      ? {
          projectRoot: configOverrides.projectRoot ?? defaultConfig.projectRoot,
          webAppRoot: configOverrides.webAppRoot ?? defaultConfig.webAppRoot,
          templatesRoot: configOverrides.templatesRoot ?? defaultConfig.templatesRoot,
        }
      : defaultConfig;

    this.registerDefaultStrategies();
  }

  /**
   * Register default path strategies
   */
  private registerDefaultStrategies(): void {
    this.strategies.set('component', new ComponentPathStrategy(this.config));
    this.strategies.set('composable', new ComposablePathStrategy(this.config));
    this.strategies.set('settings', new SettingsPathStrategy(this.config));
    this.strategies.set('page', new PagePathStrategy(this.config));
    this.strategies.set('block', new BlockPathStrategy(this.config));
  }

  /**
   * Register a custom path strategy
   */
  register(type: string, strategy: PathStrategy): void {
    this.strategies.set(type, strategy);
  }

  /**
   * Resolve paths for a given generator type
   */
  resolve(type: string, name: string, options?: PathOptions): PathResult {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`No path strategy found for generator type: ${type}`);
    }

    return strategy.resolve(name, options);
  }

  /**
   * Get available generator types
   */
  getAvailableTypes(): string[] {
    return Array.from(this.strategies.keys());
  }

  /**
   * Get template path for a generator type
   */
  getTemplatePath(type: string): string {
    return join(this.config.templatesRoot, type);
  }

  /**
   * Get relative template path for a generator type
   */
  getRelativeTemplatePath(type: string): string {
    return join('templates', type);
  }

  /**
   * Get web app path (for legacy compatibility)
   */
  getWebAppPath(): string {
    return this.config.webAppRoot;
  }

  /**
   * Get project root path
   */
  getProjectRoot(): string {
    return this.config.projectRoot;
  }
}

/**
 * Default path resolver instance
 */
export const pathResolver = new PathResolver();
