/**
 * Modern Helper Registration System
 *
 * Uses the modular plugin system to register all helpers
 */

import type { NodePlopAPI } from 'plop';
import { StringCasePlugin, ComposablePlugin, UtilityPlugin } from './plugins';
import { HelperPluginManager } from '../core';

/**
 * Register all default helper plugins with a plop instance
 */
export function registerDefaultHelpers(plop: NodePlopAPI, verbose = false): void {
  const manager = new HelperPluginManager({
    verbose,
    failOnError: false,
  });

  // Register all default plugins
  manager.register(new StringCasePlugin()).register(new ComposablePlugin()).register(new UtilityPlugin());

  // Apply all plugins to plop
  manager.applyTo(plop);

  if (verbose) {
    const summary = manager.getSummary();
    console.log(`[Helper System] Registered ${summary.helperCount} helpers from ${summary.pluginCount} plugins`);
  }
}

/**
 * Create a configured helper plugin manager for advanced usage
 */
export function createHelperManager(config?: {
  verbose?: boolean;
  failOnError?: boolean;
  includeDefaults?: boolean;
}): HelperPluginManager {
  const manager = new HelperPluginManager({
    verbose: config?.verbose ?? false,
    failOnError: config?.failOnError ?? false,
  });

  // Optionally include default plugins
  if (config?.includeDefaults !== false) {
    manager.register(new StringCasePlugin()).register(new ComposablePlugin()).register(new UtilityPlugin());
  }

  return manager;
}
