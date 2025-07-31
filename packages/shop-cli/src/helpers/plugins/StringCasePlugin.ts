/**
 * String Case Conversion Plugin
 *
 * Provides string case conversion helpers for component and file naming
 */

import type { NodePlopAPI } from 'plop';
import { BaseHelperPlugin } from '../../core/HelperPluginSystem';

/**
 * Plugin for string case conversion helpers
 */
export class StringCasePlugin extends BaseHelperPlugin {
  readonly name = 'string-case';
  readonly description = 'String case conversion helpers (pascalCase, camelCase, kebabCase, humanCase)';
  readonly version = '1.0.0';
  readonly helpers = ['pascalCase', 'camelCase', 'kebabCase', 'humanCase'];

  register(plop: NodePlopAPI): void {
    this.safeRegister(plop, 'pascalCase', (str: unknown) =>
      typeof str === 'string' && str
        ? str
            .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
            .replace(/^[a-z]/, (char) => char.toUpperCase())
        : '',
    );

    this.safeRegister(plop, 'camelCase', (str: unknown) =>
      typeof str === 'string' && str
        ? str
            .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
            .replace(/^[A-Z]/, (char) => char.toLowerCase())
        : '',
    );

    this.safeRegister(plop, 'kebabCase', (str: unknown) =>
      typeof str === 'string' && str
        ? str
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[_\s]+/g, '-')
            .toLowerCase()
        : '',
    );

    this.safeRegister(plop, 'humanCase', (str: unknown) =>
      typeof str === 'string' && str
        ? str
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/[-_]+/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : '',
    );
  }
}
