import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileTypeValidator } from '../validators/FileTypeValidator';
import { Writer } from '../writers/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class AssetDownloader {
  private writer: Writer;

  constructor(writer: Writer) {
    this.writer = writer;
  }

  downloadFavicon(url: string) {
    if (!FileTypeValidator.isIcon(url)) {
      console.warn('The URL does not point to a .ico file. Aborting the download.');
      return;
    }
    const iconPath = path.resolve(__dirname, `../../public/favicon.ico`);
    this.writer.write(url, iconPath);
  }

  downloadLogo(url: string) {
    if (!FileTypeValidator.isImage(url)) {
      console.warn('The URL does not point to an image file. Aborting the download.');
      return;
    }
    const fileType = url.split('.').pop();
    const logoPath = path.resolve(__dirname, `../../public/logo.${fileType}`);
    this.writer.write(url, logoPath);
  }
}
