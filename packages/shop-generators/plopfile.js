import registerHelpers from './src/helpers/index.js';
import registerGenerators from './src/generators/index.js';

/**
 * Plop configuration for PlentyONE Shop generators
 * @param {import('plop').NodePlopAPI} plop - The Plop API instance
 */
export default function (plop) {
  // Register handlebars helpers for naming conventions
  registerHelpers(plop);
  
  // Register template partials
  plop.setPartial('jsdoc', '{{> (lookup this "jsdoc")}}');
  plop.setPartial('vue-template', '{{> (lookup this "vue-template")}}');
  plop.setPartial('vue-script-setup', '{{> (lookup this "vue-script-setup")}}');
  plop.setPartial('typescript-interface', '{{> (lookup this "typescript-interface")}}');
  plop.setPartial('test-setup', '{{> (lookup this "test-setup")}}');
  plop.setPartial('export-statement', '{{> (lookup this "export-statement")}}');
  
  // Load template partials from files
  plop.setPartial('jsdoc', 'templates/partials/jsdoc.hbs');
  plop.setPartial('vue-template', 'templates/partials/vue-template.hbs');
  plop.setPartial('vue-script-setup', 'templates/partials/vue-script-setup.hbs');
  plop.setPartial('typescript-interface', 'templates/partials/typescript-interface.hbs');
  plop.setPartial('test-setup', 'templates/partials/test-setup.hbs');
  plop.setPartial('export-statement', 'templates/partials/export-statement.hbs');
  
  // Register all generators
  registerGenerators(plop);
  
  console.log('🚀 PlopJS generators ready for PlentyONE Shop');
}
