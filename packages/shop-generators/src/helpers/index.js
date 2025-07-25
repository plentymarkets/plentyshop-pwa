/**
 * Custom Handlebars helpers for PlentyONE Shop generators
 */

import { registerHelpers } from './naming.js';

export default function (plop) {
  // Register all naming convention helpers
  registerHelpers(plop.handlebars);
  
  console.log('✅ Custom helpers loaded');
}

export * from './naming.js';
