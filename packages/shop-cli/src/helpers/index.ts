import type { NodePlopAPI } from 'plop';

/**
 * String case conversion helpers
 */
function registerCaseHelpers(plop: NodePlopAPI): void {
  plop.setHelper('pascalCase', (str: string) =>
    str
      ? str
          .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
          .replace(/^[a-z]/, (char) => char.toUpperCase())
      : '',
  );

  plop.setHelper('camelCase', (str: string) =>
    str
      ? str
          .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
          .replace(/^[A-Z]/, (char) => char.toLowerCase())
      : '',
  );

  plop.setHelper('kebabCase', (str: string) =>
    str
      ? str
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .replace(/[_\s]+/g, '-')
          .toLowerCase()
      : '',
  );
}

/**
 * Composable-specific helpers
 */
function registerComposableHelpers(plop: NodePlopAPI): void {
  plop.setHelper('composableBaseName', (name: string) => {
    if (!name) return '';
    const baseName = name.replace(/^use/, '');
    return baseName.charAt(0).toLowerCase() + baseName.slice(1);
  });

  plop.setHelper('makeComposableName', (name: string) => {
    if (!name) return '';
    return name.startsWith('use') ? name : `use${name.charAt(0).toUpperCase() + name.slice(1)}`;
  });
}

/**
 * Utility helpers
 */
function registerUtilityHelpers(plop: NodePlopAPI): void {
  plop.setHelper('testId', (text: string) => (text ? text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : ''));
  plop.setHelper('currentDate', () => new Date().toISOString().split('T')[0]);
  plop.setHelper('currentYear', () => new Date().getFullYear());
  plop.setHelper('concat', (...args: unknown[]) => {
    // Remove the options object (last argument in Handlebars helpers)
    const values = args.slice(0, -1);
    return values.join('');
  });
  plop.setHelper('ifEquals', function (value1: unknown, value2: unknown, options: { fn: (context: unknown) => string; inverse: (context: unknown) => string }) {
    if (value1 === value2) {
      return options.fn(value1);
    }
    return options.inverse(value1);
  });
  plop.setHelper('ifNotEmpty', function (value: unknown, options: { fn: (context: unknown) => string; inverse: (context: unknown) => string }) {
    if (value && value !== '' && value !== null && value !== undefined) {
      return options.fn(value);
    }
    return options.inverse(value);
  });
}

export default function (plop: NodePlopAPI): void {
  registerCaseHelpers(plop);
  registerComposableHelpers(plop);
  registerUtilityHelpers(plop);
}
