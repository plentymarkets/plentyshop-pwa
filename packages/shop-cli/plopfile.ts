import { NodePlopAPI } from 'plop';
import { registerDefaultHelpers } from './src/helpers';
import registerGenerators from './src/generators/index';
import { PathResolver, resolveConfig, validatePath } from './src/core';
import { validateProjectStructure } from './src/utils/project-validation';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cliRoot = __dirname;
const projectRoot = path.resolve(cliRoot, '../../');

/**
 * Plop configuration for PlentyONE Shop generators
 */
export default function plopConfiguration(plop: NodePlopAPI): void {
  registerDefaultHelpers(plop, true);

  const partialsDir = path.join(__dirname, 'templates/partials');
  const partialFiles = fs.readdirSync(partialsDir).filter((file) => file.endsWith('.hbs'));

  for (const file of partialFiles) {
    const partialName = path.basename(file, '.hbs');
    const partialContent = fs.readFileSync(path.join(partialsDir, file), 'utf-8');
    plop.setPartial(partialName, partialContent);
  }

  const cliFlag = process.env.PLENTYSHOP_WEB_APP_PATH ? { webAppPath: process.env.PLENTYSHOP_WEB_APP_PATH } : undefined;
  const config = resolveConfig(cliFlag);

  if (!validatePath(projectRoot, config.webAppPath)) {
    console.error(`\nError: Cannot find web app directory at: ${config.webAppPath}`);
    console.error('Please check your configuration and ensure the path exists.\n');
    process.exit(1);
  }

  const projectValidation = validateProjectStructure(projectRoot, config.webAppPath);
  if (!projectValidation.valid) {
    console.error(`\n${projectValidation.message}\n`);
    if (projectValidation.errors) {
      for (const error of projectValidation.errors) {
        console.error(`  - ${error}`);
      }
    }
    console.error('');
    process.exit(1);
  }

  const pathResolver = new PathResolver({
    cliPackageRoot: cliRoot,
    webAppRoot: path.join(projectRoot, config.webAppPath),
  });
  registerGenerators(plop, pathResolver);

  console.log('🚀 PlopJS generators ready for PlentyONE Shop');
}
