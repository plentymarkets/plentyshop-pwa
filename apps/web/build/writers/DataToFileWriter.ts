import { writeFileSync } from 'node:fs';
import { Writer } from './types';

export class DataToFileWriter implements Writer {
  write(data: string, path: string) {
    writeFileSync(path, data, 'utf8');
  }
}
