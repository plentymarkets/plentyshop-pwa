import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Writer } from './types/Writer';
import { FileTypeValidator } from './validators/FileTypeValidator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const fetchFavicon = async (faviconUrl: string, writer: Writer): Promise<string> => {
  if (!FileTypeValidator.isIcon(faviconUrl)) {
    console.warn('The URL does not point to a .ico file. Aborting the download.');
    return '';
  }

  console.log('Downloading favicon from:', faviconUrl);

  const iconPath = path.resolve(__dirname, `../public/favicon.ico`);

  writer.write(faviconUrl, iconPath);

  return iconPath;
};
