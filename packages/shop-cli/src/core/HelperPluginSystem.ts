/**
 * Helper Plugin System for PlentyONE Shop CLI
 *
 * This module provides a modular plugin system for Handlebars helpers,
 * allowing easy registration, extension, and management of helper functions.
 */

import type { NodePlopAPI } from 'plop';
import type { HelperPlugin, PluginManagerConfig, PluginManagerSummary } from '../types/helper-plugin-system';

/**
 * Base abstract class for helper plugins
 */
export abstract class BaseHelperPlugin implements HelperPlugin {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly version: string;
  abstract readonly helpers: string[];

  abstract register(plop: NodePlopAPI): void;

  /**
   * Default validation - always passes
   */
  validate(): boolean {
    return true;
  }

  /**
   * Default initialization - no-op
   */
  init(_config?: Record<string, unknown>): void {
    // Default implementation does nothing
  }

  /**
   * Helper method to safely register a helper with error handling
   */
  protected safeRegister(plop: NodePlopAPI, helperName: string, helperFn: (...args: unknown[]) => unknown): void {
    try {
      plop.setHelper(helperName, helperFn);
    } catch (error) {
      console.warn(`[${this.name}] Failed to register helper '${helperName}':`, error);
    }
  }

  /**
   * Check if a helper is already registered
   */
  protected isHelperRegistered(_plop: NodePlopAPI, _helperName: string): boolean {
    // Note: Plop doesn't provide a direct way to check if helpers are registered
    // This method is provided for potential future use or subclass implementation
    return false;
  }
}

/**
 * Plugin manager for handling helper plugin registration and lifecycle
 */
export class HelperPluginManager {
  private readonly plugins: Map<string, HelperPlugin> = new Map();
  private readonly registeredHelpers: Set<string> = new Set();
  private readonly config: PluginManagerConfig;

  constructor(config: PluginManagerConfig = {}) {
    this.config = {
      verbose: false,
      failOnError: false,
      ...config,
    };
  }

  /**
   * Register a new helper plugin
   */
  register(plugin: HelperPlugin): this {
    if (this.plugins.has(plugin.name)) {
      const message = `Plugin '${plugin.name}' is already registered`;
      if (this.config.failOnError) {
        throw new Error(message);
      }
      console.warn(`[HelperPluginManager] ${message}`);
      return this;
    }

    // Validate plugin
    if (plugin.validate && !plugin.validate()) {
      const message = `Plugin '${plugin.name}' failed validation`;
      if (this.config.failOnError) {
        throw new Error(message);
      }
      console.warn(`[HelperPluginManager] ${message}`);
      return this;
    }

    // Initialize plugin
    if (plugin.init) {
      plugin.init(this.config.globalConfig);
    }

    this.plugins.set(plugin.name, plugin);

    if (this.config.verbose) {
      console.log(`[HelperPluginManager] Registered plugin '${plugin.name}' v${plugin.version}`);
    }

    return this;
  }

  /**
   * Register multiple plugins at once
   */
  registerAll(plugins: HelperPlugin[]): this {
    plugins.forEach((plugin) => this.register(plugin));
    return this;
  }

  /**
   * Apply all registered plugins to a plop instance
   */
  applyTo(plop: NodePlopAPI): void {
    for (const [name, plugin] of this.plugins) {
      try {
        plugin.register(plop);

        // Track registered helpers
        plugin.helpers.forEach((helper) => this.registeredHelpers.add(helper));

        if (this.config.verbose) {
          console.log(`[HelperPluginManager] Applied plugin '${name}' (${plugin.helpers.length} helpers)`);
        }
      } catch (error) {
        const message = `Failed to apply plugin '${name}': ${error}`;
        if (this.config.failOnError) {
          throw new Error(message);
        }
        console.error(`[HelperPluginManager] ${message}`);
      }
    }

    if (this.config.verbose) {
      console.log(
        `[HelperPluginManager] Applied ${this.plugins.size} plugins, registered ${this.registeredHelpers.size} helpers`,
      );
    }
  }

  /**
   * Get information about a specific plugin
   */
  getPlugin(name: string): HelperPlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all registered plugin names
   */
  getPluginNames(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Get all registered helper names
   */
  getRegisteredHelpers(): string[] {
    return Array.from(this.registeredHelpers);
  }

  /**
   * Check if a specific helper has been registered by any plugin
   */
  hasHelper(helperName: string): boolean {
    return this.registeredHelpers.has(helperName);
  }

  /**
   * Get summary information about the plugin manager state
   */
  getSummary(): PluginManagerSummary {
    return {
      pluginCount: this.plugins.size,
      helperCount: this.registeredHelpers.size,
      plugins: Array.from(this.plugins.values()).map((plugin) => ({
        name: plugin.name,
        version: plugin.version,
        description: plugin.description,
        helpers: [...plugin.helpers],
      })),
    };
  }

  /**
   * Clear all registered plugins and helpers
   */
  clear(): void {
    this.plugins.clear();
    this.registeredHelpers.clear();
  }
}
