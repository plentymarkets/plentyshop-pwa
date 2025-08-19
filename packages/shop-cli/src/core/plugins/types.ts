/**
 * Type definitions for the Helper Plugin System
 *
 * This file contains all interfaces and types used by the modular
 * helper plugin system for PlopJS code generation.
 */

import type { NodePlopAPI } from 'plop';

/**
 * Interface for helper plugin implementations
 *
 * All helper plugins must implement this interface to be compatible
 * with the HelperPluginManager system.
 */
export interface HelperPlugin {
  /** Unique name identifier for the plugin */
  readonly name: string;

  /** Human-readable description of what this plugin provides */
  readonly description: string;

  /** Version of the plugin for compatibility tracking */
  readonly version: string;

  /** Array of helper names that this plugin registers */
  readonly helpers: string[];

  /** Register all helpers provided by this plugin */
  register(plop: NodePlopAPI): void;

  /** Optional: Validate plugin dependencies */
  validate?(): boolean;

  /** Optional: Initialize plugin with configuration */
  init?(config?: Record<string, unknown>): void;
}

/**
 * Configuration options for the HelperPluginManager
 */
export interface PluginManagerConfig {
  /** Whether to log plugin registration details */
  verbose?: boolean;

  /** Whether to fail if a plugin fails to register */
  failOnError?: boolean;

  /** Global configuration to pass to all plugins */
  globalConfig?: Record<string, unknown>;
}

/**
 * Summary information about registered plugins and helpers
 */
export interface PluginManagerSummary {
  /** Number of registered plugins */
  pluginCount: number;

  /** Number of registered helpers */
  helperCount: number;

  /** Detailed information about each registered plugin */
  plugins: Array<{
    name: string;
    version: string;
    description: string;
    helpers: string[];
  }>;
}

/**
 * Plugin registration result
 */
export interface PluginRegistrationResult {
  /** Whether the plugin was successfully registered */
  success: boolean;

  /** Plugin name */
  pluginName: string;

  /** Error message if registration failed */
  error?: string;

  /** Number of helpers registered by this plugin */
  helperCount: number;
}
