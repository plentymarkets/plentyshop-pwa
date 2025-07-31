/**
 * Composable Helpers Plugin
 *
 * Provides composable-specific helpers for naming and structure
 */

import type { NodePlopAPI } from 'plop';
import { BaseHelperPlugin } from '../../core/HelperPluginSystem';

/**
 * Plugin for composable-specific helpers
 */
export class ComposablePlugin extends BaseHelperPlugin {
  readonly name = 'composable';
  readonly description = 'Composable-specific naming helpers (composableBaseName, makeComposableName)';
  readonly version = '1.0.0';
  readonly helpers = ['composableBaseName', 'makeComposableName'];

  register(plop: NodePlopAPI): void {
    this.safeRegister(plop, 'composableBaseName', (name: unknown) => {
      if (typeof name !== 'string' || !name) return '';
      const baseName = name.replace(/^use/, '');
      return baseName.charAt(0).toLowerCase() + baseName.slice(1);
    });

    this.safeRegister(plop, 'makeComposableName', (name: unknown) => {
      if (typeof name !== 'string' || !name) return '';
      return name.startsWith('use') ? name : `use${name.charAt(0).toUpperCase() + name.slice(1)}`;
    });
  }
}
