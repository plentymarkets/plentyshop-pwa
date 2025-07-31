/**
 * Utility Helpers Plugin
 *
 * Provides general utility helpers for templates
 */

import type { NodePlopAPI } from 'plop';
import { BaseHelperPlugin } from '../../core/HelperPluginSystem';

/**
 * Plugin for utility helpers
 */
export class UtilityPlugin extends BaseHelperPlugin {
  readonly name = 'utility';
  readonly description =
    'General utility helpers (testId, currentDate, currentYear, concat, filePath, importPath, ifEquals, ifNotEmpty)';
  readonly version = '1.0.0';
  readonly helpers = [
    'testId',
    'currentDate',
    'currentYear',
    'concat',
    'filePath',
    'importPath',
    'ifEquals',
    'ifNotEmpty',
  ];

  register(plop: NodePlopAPI): void {
    this.registerUtilityHelpers(plop);
    this.registerPathHelpers(plop);
    this.registerConditionalHelpers(plop);
  }

  private registerUtilityHelpers(plop: NodePlopAPI): void {
    this.safeRegister(plop, 'testId', (text: unknown) =>
      typeof text === 'string' && text ? text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : '',
    );

    this.safeRegister(plop, 'currentDate', () => new Date().toISOString().split('T')[0]);

    this.safeRegister(plop, 'currentYear', () => new Date().getFullYear());

    this.safeRegister(plop, 'concat', (...args: unknown[]) => {
      // Remove the options object (last argument in Handlebars helpers)
      const values = args.slice(0, -1);
      return values.join('');
    });
  }

  private registerPathHelpers(plop: NodePlopAPI): void {
    this.safeRegister(plop, 'filePath', (...args: unknown[]) => {
      // Remove the options object (last argument in Handlebars helpers)
      const parts = args.slice(0, -1) as string[];
      return parts.filter(Boolean).join('/');
    });

    this.safeRegister(plop, 'importPath', (from: unknown, to: unknown) => {
      if (typeof from !== 'string' || typeof to !== 'string' || !from || !to) return '';

      // If it's in the same directory
      if (!to.includes('/')) {
        return `./${to}`;
      }

      // If it's already a relative path
      if (to.startsWith('./') || to.startsWith('../')) {
        return to;
      }

      // Default to relative path
      return `./${to}`;
    });
  }

  private registerConditionalHelpers(plop: NodePlopAPI): void {
    this.safeRegister(plop, 'ifEquals', function (...args: unknown[]) {
      const [value1, value2, options] = args;
      const opts = options as { fn: (context: unknown) => string; inverse: (context: unknown) => string };
      if (value1 === value2) {
        return opts.fn(value1);
      }
      return opts.inverse(value1);
    });

    this.safeRegister(plop, 'ifNotEmpty', function (...args: unknown[]) {
      const [value, options] = args;
      const opts = options as { fn: (context: unknown) => string; inverse: (context: unknown) => string };
      if (value && value !== '' && value !== null && value !== undefined) {
        return opts.fn(value);
      }
      return opts.inverse(value);
    });
  }
}
