import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'culori';

const hex2rgb = (hex: string) => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const generateScssVariables = () => {
  const primary700Hex = process.env.PRIMARY700 || '12 121 146';
  const secondary700Hex = process.env.SECONDARY700 || '165 105 3';

  let scssContent = '';

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const isRgb = (value: string) => /^(?:\d{1,3}\s){2}\d{1,3}$/.test(value);

  if (isRgb(primary700Hex)) {
    scssContent += `$primary700: ${primary700Hex};\n`;
  } else {
    const primary700 = parse(primary700Hex);

    if (!primary700) {
      throw new Error('Failed to parse PRIMARY700 hex value.');
    }

    const parsedMain = hex2rgb(primary700Hex);
    scssContent += `$primary700: ${parsedMain.r} ${parsedMain.g} ${parsedMain.b};\n`;
  }

  if (isRgb(secondary700Hex)) {
    scssContent += `$secondary700: ${secondary700Hex};`;
  } else {
    const secondary700 = parse(secondary700Hex);

    if (!secondary700) {
      throw new Error('Failed to parse SECONDARY700 hex value.');
    }

    const parsedSecond = hex2rgb(secondary700Hex);
    scssContent += `$secondary700: ${parsedSecond.r} ${parsedSecond.g} ${parsedSecond.b};`;
  }

  const scssVariablesDir = path.resolve(__dirname, '../assets');
  const scssVariablesFilePath = path.resolve(scssVariablesDir, '_variables.scss');

  if (!fs.existsSync(scssVariablesDir)) {
    fs.mkdirSync(scssVariablesDir, { recursive: true });
  }

  fs.writeFileSync(scssVariablesFilePath, scssContent, 'utf8');
};

export default generateScssVariables;
