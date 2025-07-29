import { NodePlopAPI } from 'plop';
import registerHelpers from './src/helpers/index';
import registerGenerators from './src/generators/index';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Plop configuration for PlentyONE Shop generators
 */
export default function (plop: NodePlopAPI): void {
  // Register handlebars helpers for naming conventions
  registerHelpers(plop);

  // Load template partials from files
  const partialsDir = path.join(__dirname, 'templates/partials');
  const partialFiles = fs.readdirSync(partialsDir).filter(file => file.endsWith('.hbs'));
  
  partialFiles.forEach(file => {
    const partialName = path.basename(file, '.hbs');
    const partialContent = fs.readFileSync(path.join(partialsDir, file), 'utf-8');
    plop.setPartial(partialName, partialContent);
  });

  // Register all generators
  registerGenerators(plop);

  console.log('🚀 PlopJS generators ready for PlentyONE Shop');
}
