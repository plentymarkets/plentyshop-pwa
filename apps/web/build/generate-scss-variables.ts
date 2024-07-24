import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'culori';

const hex2rgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const generateScssVariables = () => {
  const primary700Hex = process.env.PRIMARY700 || '';

  if (!primary700Hex) {
    throw new Error('PRIMARY700 environment variable is not set.');
  }

  const primary700 = parse(primary700Hex);

  if (!primary700) {
    throw new Error('Failed to parse PRIMARY700 hex value.');
  }

  // const primary700Rgb = formatRgb(primary700);
  const parsed = hex2rgb(primary700Hex);
  const scssContent = `$primary700: ${parsed.r} ${parsed.g} ${parsed.b};`;
  const scssVariablesDir = path.resolve(__dirname, 'assets/scss');
  const scssVariablesFilePath = path.resolve(scssVariablesDir, '_variables.scss');

  if (!fs.existsSync(scssVariablesDir)) {
    fs.mkdirSync(scssVariablesDir, { recursive: true });
  }

  fs.writeFileSync(scssVariablesFilePath, scssContent, 'utf8');
};

export default generateScssVariables;



