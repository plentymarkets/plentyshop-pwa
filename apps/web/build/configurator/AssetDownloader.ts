import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileTypeValidator } from '../validators/FileTypeValidator';
import { Writer } from '../writers/types';

export class AssetDownloader {
  private __filename = fileURLToPath(import.meta.url);
  private __dirname = dirname(this.__filename);
  private writer: Writer;

  constructor(writer: Writer) {
    this.writer = writer;
  }

  async downloadFavicon(url: string) {
    if (!FileTypeValidator.isIcon(url)) {
      console.warn('The URL does not point to a .ico file. Aborting the download.');
      return;
    }
    const iconPath = path.resolve(this.__dirname, `../../public/favicon.ico`);
    await this.writer.write(url, iconPath);
  }

  async downloadLogo(url: string) {
    if (!FileTypeValidator.isImage(url)) {
      console.warn('The URL does not point to an image file. Aborting the download.');
      return;
    }
    const fileType = url.split('.').pop();
    const logoPath = path.resolve(this.__dirname, `../../public/logo.${fileType}`);
    await this.writer.write(url, logoPath);
  }
}
