import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileTypeValidator } from '../validators/FileTypeValidator';
import type { Writer } from '../writers/types';
import type { Logger } from '../logs/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class AssetDownloader {
  private writer: Writer;
  private logger: Logger;

  constructor(writer: Writer, logger: Logger) {
    this.writer = writer;
    this.logger = logger;
  }

  downloadFavicon(url: string) {
    if (!FileTypeValidator.isIcon(url)) {
      this.logger.warn('The URL does not point to a .ico file. Aborting the download.');
      return;
    }
    this.logger.info('Downloading favicon...');
    const iconPath = path.resolve(__dirname, `../../public/favicon.ico`);
    this.writer.write(url, iconPath);
  }

  downloadLogo(url: string) {
    if (!FileTypeValidator.isImage(url)) {
      this.logger.warn('The URL does not point to an image file. Aborting the download.');
      return;
    }
    this.logger.info('Downloading logo...');
    const fileType = url.split('.').pop();
    const logoPath = path.resolve(__dirname, `../../public/images/logo.${fileType}`);
    this.writer.write(url, logoPath);
  }
}
