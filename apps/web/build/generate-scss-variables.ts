import fs from 'node:fs';
import path from 'node:path';
// import { parse } from 'culori';
import { hex2rgb, getTailwindColorsOklch } from '../utils/tailwindHelper.js';
import { converter, formatRgb, parse } from 'culori/fn';

const primary700Hex = process.env.PRIMARY700 || '12 121 146';
const secondary700Hex = process.env.SECONDARY700 || '165 105 3';

const oklchToRgb = (oklch: string) => {
  const toRgb = converter('rgb');
  const rgbColor = toRgb(parse(oklch));
  console.log(oklch + 'here');
  return formatRgb(rgbColor);
};

const generateColorPallete = () => {
  const colorList = getTailwindColorsOklch(primary700Hex);
  console.log(colorList);
  const rgbColorList = colorList.map((item) => ({
    weight: item.weight,
    value: oklchToRgb(item.value),
  }));

  console.log('Converted RGB color list:', rgbColorList);
  return rgbColorList;

  // console.log(colorList);
  // const values = colorList.map((item) => item.value);
  // console.log(values);
  // console.log(values[0]);
  // console.log(oklchToRgb(values[0]));
};

const generateScssVariables = () => {
  let scssContent = '';
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const isRgb = (value: string) => /^(?:\d{1,3}\s){2}\d{1,3}$/.test(value);

  if (isRgb(primary700Hex)) {
    scssContent += `$primary700: ${primary700Hex};\n`;
  } else {
    const parsedMain = hex2rgb(primary700Hex);
    scssContent += `$primary700: ${parsedMain.r} ${parsedMain.g} ${parsedMain.b};\n`;
  }

  if (isRgb(secondary700Hex)) {
    scssContent += `$secondary700: ${secondary700Hex};`;
  } else {
    const parsedSecond = hex2rgb(secondary700Hex);
    scssContent += `$secondary700: ${parsedSecond.r} ${parsedSecond.g} ${parsedSecond.b};`;
  }

  const scssVariablesDir = path.resolve(__dirname, '../assets');
  const scssVariablesFilePath = path.resolve(scssVariablesDir, '_variables.scss');

  if (!fs.existsSync(scssVariablesDir)) {
    fs.mkdirSync(scssVariablesDir, { recursive: true });
  }

  fs.writeFileSync(scssVariablesFilePath, scssContent, 'utf8');

  generateColorPallete();
};

export default generateScssVariables;
