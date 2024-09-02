import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Writer } from './types/Writer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const fetchLogo = async (logoUrl: string, writer: Writer): Promise<string> => {
  if (!logoUrl) {
    console.warn('Logo URL not found.');
    return '';
  }

  console.log('Fetching logo from:', logoUrl);

  const fileType = logoUrl.split('.').pop();
  const logoPath = path.resolve(__dirname, `../public/logo.${fileType}`);

  writer.write(logoUrl, logoPath);

  return logoPath;
};
