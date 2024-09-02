import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Writer } from './types/Writer';
import { FileTypeValidator } from './validators/FileTypeValidator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const fetchLogo = async (logoUrl: string, writer: Writer): Promise<string> => {
  if (!FileTypeValidator.isImage(logoUrl)) {
    console.warn('The URL does not point to an image file. Aborting the download.');
    return '';
  }

  console.log('Downloading logo from:', logoUrl);

  const fileType = logoUrl.split('.').pop();
  const logoPath = path.resolve(__dirname, `../public/logo.${fileType}`);

  writer.write(logoUrl, logoPath);

  return logoPath;
};
