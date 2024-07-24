import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'culori';

const hex2rgb = (hex:string) => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const generateScssVariables = () => {
  const primary700Hex = process.env.PRIMARY700 || '';
  const secondary700Hex = process.env.SECONDARY700 || '';

  if (!primary700Hex) {
    throw new Error('PRIMARY700 environment variable is not set.');
  }

  if (!secondary700Hex) {
    throw new Error('SECONDARY700 environment variable is not set.');
  }

  const primary700 = parse(primary700Hex);
  const secondary700 = parse(secondary700Hex);

  if (!primary700) {
    throw new Error('Failed to parse PRIMARY700 hex value.');
  }

  if (!secondary700) {
    throw new Error('Failed to parse SECONDARY700 hex value.');
  }

  const parsedMain = hex2rgb(primary700Hex);
  const parsedSecond = hex2rgb(secondary700Hex);
  
  const scssContent = `$primary700: ${parsedMain.r} ${parsedMain.g} ${parsedMain.b};\n$secondary700: ${parsedSecond.r} ${parsedSecond.g} ${parsedSecond.b};`;
  const scssVariablesDir = path.resolve(__dirname, '../assets');
  const scssVariablesFilePath = path.resolve(scssVariablesDir, '_variables.scss');

  if (!fs.existsSync(scssVariablesDir)) {
    fs.mkdirSync(scssVariablesDir, { recursive: true });
  }

  fs.writeFileSync(scssVariablesFilePath, scssContent, 'utf8');
};

export default generateScssVariables;
