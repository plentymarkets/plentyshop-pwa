import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @param {import('plop').NodePlopAPI} plop
 */
export default function (plop) {
  // Set base path for templates
  plop.setDefaultInclude({ generators: true });
  
  // Load custom helpers
  plop.load(join(__dirname, 'src/helpers/index.js'));
  
  // Load generators
  plop.load(join(__dirname, 'src/generators/index.js'));
  
  console.log('🚀 PlentyONE Shop Generators loaded successfully!');
}
