import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import type { UserConfig } from './types';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<UserConfig> = {
  webAppPath: 'apps/web/app',
};

/**
 * Config file name to search for
 */
const CONFIG_FILE_NAME = '.plentyone/shop-cli.json';

/**
 * Find config file by walking up directory tree from start path
 * @param startPath - Starting directory path (defaults to process.cwd())
 * @returns Path to config file or null if not found
 */
export function findConfigFile(startPath: string = process.cwd()): string | null {
  let currentPath = startPath;
  const root = '/';

  while (currentPath !== root) {
    const configPath = join(currentPath, CONFIG_FILE_NAME);
    if (existsSync(configPath)) {
      return configPath;
    }
    const parentPath = dirname(currentPath);
    if (parentPath === currentPath) {
      break; // Reached root
    }
    currentPath = parentPath;
  }

  return null;
}

/**
 * Load and parse config file
 * @param configPath - Path to config file
 * @returns Parsed config object or empty object on error
 */
export function loadConfig(configPath: string): UserConfig {
  try {
    const content = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(content);
    return config;
  } catch (error) {
    console.warn(`Warning: Could not read config file at ${configPath}`);
    if (error instanceof SyntaxError) {
      console.warn('Config file contains invalid JSON');
    }
    return {};
  }
}

/**
 * Resolve final configuration by merging CLI flags, config file, and defaults
 * Priority: CLI flags > config file > defaults
 * @param cliFlags - Optional CLI flag overrides
 * @returns Merged configuration
 */
export function resolveConfig(cliFlags?: Partial<UserConfig>): Required<UserConfig> {
  const configFilePath = findConfigFile();
  const fileConfig = configFilePath ? loadConfig(configFilePath) : {};

  return {
    webAppPath: cliFlags?.webAppPath ?? fileConfig.webAppPath ?? DEFAULT_CONFIG.webAppPath,
  };
}

/**
 * Validate that a path exists
 * @param basePath - Base path (usually project root)
 * @param webAppPath - Relative web app path to validate
 * @returns true if path exists, false otherwise
 */
export function validatePath(basePath: string, webAppPath: string): boolean {
  const fullPath = join(basePath, webAppPath);
  const exists = existsSync(fullPath);

  if (!exists) {
    console.warn(`Warning: Web app path does not exist: ${fullPath}`);
    console.warn(`Expected to find directory at: ${webAppPath}`);
  }

  return exists;
}
