/**
 * Handlebars helpers for PlentyONE Shop generators
 * Focused on actually used naming conventions in the project
 */

/**
 * Converts string to PascalCase (for components)
 * Examples: 'hello world' -> 'HelloWorld', 'my-component' -> 'MyComponent'
 */
export function pascalCase(str) {
  if (!str) return '';
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^(.)/, (_, char) => char.toUpperCase());
}

/**
 * Converts string to camelCase (for composables, variables)
 * Examples: 'hello world' -> 'helloWorld', 'my-component' -> 'myComponent'
 */
export function camelCase(str) {
  if (!str) return '';
  const pascal = pascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Converts string to kebab-case (for files, CSS, data-testid)
 * Examples: 'HelloWorld' -> 'hello-world', 'myComponent' -> 'my-component'
 */
export function kebabCase(str) {
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
export function composableBaseName(str) {
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
export function makeComposableName(str) {
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
export function testId(str) {
  if (!str) return '';
  return kebabCase(str);
}

/**
 * Creates a file path from components
 * Examples: ('components', 'ProductCard', 'types.ts') -> 'components/ProductCard/types.ts'
 */
export function filePath(...parts) {
  return parts.filter(Boolean).join('/');
}

/**
 * Creates a relative import path
 * Examples: ('ProductCard', 'types') -> './types'
 */
export function importPath(from, to) {
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
export function currentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generates current year
 */
export function currentYear() {
  return new Date().getFullYear();
}

/**
 * Conditionally includes content if values are equal
 */
export function ifEquals(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
}

/**
 * Conditionally includes content if value is not empty
 */
export function ifNotEmpty(value, options) {
  if (value && value.trim && value.trim() !== '') {
    return options.fn(this);
  }
  return options.inverse(this);
}

/**
 * Registers core helpers with a Handlebars instance
 */
export function registerHelpers(handlebars) {
  handlebars.registerHelper('pascalCase', pascalCase);
  handlebars.registerHelper('camelCase', camelCase);
  handlebars.registerHelper('kebabCase', kebabCase);
  handlebars.registerHelper('composableBaseName', composableBaseName);
  handlebars.registerHelper('makeComposableName', makeComposableName);
  handlebars.registerHelper('testId', testId);
  handlebars.registerHelper('filePath', filePath);
  handlebars.registerHelper('importPath', importPath);
  handlebars.registerHelper('currentDate', currentDate);
  handlebars.registerHelper('currentYear', currentYear);
  handlebars.registerHelper('ifEquals', ifEquals);
  handlebars.registerHelper('ifNotEmpty', ifNotEmpty);
}
