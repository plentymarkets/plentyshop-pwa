import axios from 'axios';
import { existsSync, writeFileSync } from 'node:fs';
import type { Writer } from './types';
import type { Logger } from '../logs/types';

export class CdnToFileWriter implements Writer {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async write(url: string, path: string) {
    try {
      const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'arraybuffer',
      });

      const imageBuffer = response.data;

      writeFileSync(path, imageBuffer);
    } catch (error) {
      this.logger.error(`Error downloading file from ${url}: ${error instanceof Error ? error.message : error}`);
    }
  }

  writeMissing(data: string, path: string) {
    if (!existsSync(path)) {
      this.write(data, path);
    }
  }
}
