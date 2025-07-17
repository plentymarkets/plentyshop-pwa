import { writeFileSync, existsSync } from 'node:fs';
import type { Writer } from './types';
import type { Logger } from '../logs/types';

export class DataToFileWriter implements Writer {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  write(data: string, path: string) {
    try {
      writeFileSync(path, data, 'utf8');
    } catch (error) {
      this.logger.error(`Error writing data to ${path}: ${error instanceof Error ? error.message : error}`);
    }
  }

  writeMissing(data: string, path: string) {
    if (!existsSync(path)) {
      this.write(data, path);
    }
  }
}
