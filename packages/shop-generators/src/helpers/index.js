/**
 * Custom Handlebars helpers for PlentyONE Shop generators
 */

export default function (plop) {
  // PascalCase helper
  plop.setHelper('pascalCase', (text) => {
    return text.replace(/(?:^|\s|-)(\w)/g, (match, letter) => letter.toUpperCase()).replace(/\s|-/g, '');
  });

  // camelCase helper
  plop.setHelper('camelCase', (text) => {
    const pascal = text.replace(/(?:^|\s|-)(\w)/g, (match, letter) => letter.toUpperCase()).replace(/\s|-/g, '');
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  });

  // kebab-case helper
  plop.setHelper('kebabCase', (text) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  });

  // snake_case helper
  plop.setHelper('snakeCase', (text) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  });

  // CONSTANT_CASE helper
  plop.setHelper('constantCase', (text) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toUpperCase();
  });

  // Helper to generate current date
  plop.setHelper('currentDate', () => {
    return new Date().toISOString().split('T')[0];
  });

  // Helper to generate current year
  plop.setHelper('currentYear', () => {
    return new Date().getFullYear();
  });

  console.log('✅ Custom helpers loaded');
}
