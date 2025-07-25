/**
 * Custom Handlebars helpers for PlentyONE Shop generators
 */

import type { NodePlopAPI } from 'plop';

export default function (plop: NodePlopAPI): void {
  // Register individual helpers directly with plop
  plop.setHelper('pascalCase', (str: string) => str ? str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '').replace(/^(.)/, (_, char) => char.toUpperCase()) : '');
  plop.setHelper('camelCase', (str: string) => {
    if (!str) return '';
    const pascal = str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '').replace(/^(.)/, (_, char) => char.toUpperCase());
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  });
  plop.setHelper('kebabCase', (str: string) => str ? str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase() : '');
  plop.setHelper('composableBaseName', (str: string) => str?.startsWith('use') ? str.slice(3) : str || '');
  plop.setHelper('makeComposableName', (str: string) => {
    if (!str) return '';
    if (str.startsWith('use')) return str;
    const pascal = str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '').replace(/^(.)/, (_, char) => char.toUpperCase());
    return 'use' + pascal;
  });
  plop.setHelper('testId', (str: string) => str ? str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase() : '');
  plop.setHelper('currentDate', () => new Date().toISOString().split('T')[0]);
  plop.setHelper('currentYear', () => new Date().getFullYear());
  
  console.log('✅ Custom helpers loaded');
}

export * from './naming';
