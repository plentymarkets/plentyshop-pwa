/**
 * Type definitions for Path Resolution System
 */

/**
 * Options for path resolution
 */
export interface PathOptions {
  /** Custom file name (without extension) */
  fileName?: string;
  /** File extension */
  extension?: string;
  /** Category for settings components */
  category?: string;
  /** Whether page is dynamic */
  isDynamic?: boolean;
  /** Custom web app path */
  webAppPath?: string;
}

/**
 * Result of path resolution
 */
export interface PathResult {
  /** Base directory path (relative to shop-cli) */
  basePath: string;
  /** Main file path */
  mainFile: string;
  /** Types file path (optional) */
  typesFile?: string;
  /** Index file path (optional) */
  indexFile?: string;
  /** Test file path (optional) */
  testFile?: string;
  /** Trigger file path (for settings, optional) */
  triggerFile?: string;
  /** Form file path (for blocks, optional) */
  formFile?: string;
  /** All generated file paths */
  files: string[];
}

/**
 * Strategy interface for path resolution
 */
export interface PathStrategy {
  resolve(name: string, options?: PathOptions): PathResult;
}

/**
 * Configuration interface for path resolution
 */
export interface PathConfig {
  readonly projectRoot: string;
  readonly webAppRoot: string;
  readonly templatesRoot: string;
}
