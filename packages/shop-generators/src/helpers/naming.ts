/**
 * Handlebars helpers for PlentyONE Shop generators
 * Focused on actually used naming conventions in the project
 */

import type Handlebars from 'handlebars';

// Handlebars helper options interface
interface HelperOptions {
  fn: (context: any) => string;
  inverse: (context: any) => string;
}

/**
 * Converts string to PascalCase (for components)
 * Examples: 'hello world' -> 'HelloWorld', 'my-component' -> 'MyComponent'
 */
export function pascalCase(str: string): string {
  if (!str) return '';
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (_, char) => char.toUpperCase());
}

/**
 * Converts string to camelCase (for composables, variables)
 * Examples: 'hello world' -> 'helloWorld', 'my-component' -> 'myComponent'
 */
export function camelCase(str: string): string {
  if (!str) return '';
  const pascal = pascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Converts string to kebab-case (for files, CSS, data-testid)
 * Examples: 'HelloWorld' -> 'hello-world', 'myComponent' -> 'my-component'
 */
export function kebabCase(str: string): string {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Extracts the main part from a composable name (removes 'use' prefix)
 * Examples: 'useProductCart' -> 'ProductCart', 'useAPI' -> 'API'
 */
export function composableBaseName(str: string): string {
  if (!str) return '';
  if (str.startsWith('use')) {
    return str.slice(3);
  }
  return str;
}

/**
 * Creates a composable name from a base name
 * Examples: 'ProductCart' -> 'useProductCart', 'API' -> 'useAPI'
 */
export function makeComposableName(str: string): string {
  if (!str) return '';
  if (str.startsWith('use')) {
    return str;
  }
  return 'use' + pascalCase(str);
}

/**
 * Creates a data-testid attribute value
 * Examples: 'ProductCard' -> 'product-card', 'UserProfile' -> 'user-profile'
 */
export function testId(str: string): string {
  if (!str) return '';
  return kebabCase(str);
}

/**
 * Creates a file path from components
 * Examples: ('components', 'ProductCard', 'types.ts') -> 'components/ProductCard/types.ts'
 */
export function filePath(...parts: string[]): string {
  return parts.filter(Boolean).join('/');
}

/**
 * Creates a relative import path
 * Examples: ('ProductCard', 'types') -> './types'
 */
export function importPath(from: string, to: string): string {
  if (!from || !to) return '';

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
}

/**
 * Generates current date in ISO format
 */
export function currentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generates current year
 */
export function currentYear(): number {
  return new Date().getFullYear();
}

/**
 * Conditionally includes content if values are equal
 */
export function ifEquals(a: any, b: any, options: HelperOptions): string {
  if (a === b) {
    return options.fn({});
  }
  return options.inverse({});
}

/**
 * Conditionally includes content if value is not empty
 */
export function ifNotEmpty(value: any, options: HelperOptions): string {
  if (value?.trim?.() && value.trim() !== '') {
    return options.fn({});
  }
  return options.inverse({});
}

/**
 * Registers core helpers with a Handlebars instance
 */
export function registerHelpers(handlebars: typeof Handlebars): void {
  handlebars.registerHelper('pascalCase', pascalCase);
  handlebars.registerHelper('camelCase', camelCase);
  handlebars.registerHelper('kebabCase', kebabCase);
  handlebars.registerHelper('composableBaseName', composableBaseName);
  handlebars.registerHelper('makeComposableName', makeComposableName);
  handlebars.registerHelper('testId', testId);
  handlebars.registerHelper('filePath', (...args: any[]) => {
    // Remove Handlebars options from args and call filePath
    const parts = args.slice(0, -1) as string[];
    return filePath(...parts);
  });
  handlebars.registerHelper('importPath', importPath);
  handlebars.registerHelper('currentDate', currentDate);
  handlebars.registerHelper('currentYear', currentYear);
  handlebars.registerHelper('ifEquals', ifEquals);
  handlebars.registerHelper('ifNotEmpty', ifNotEmpty);
}
