import { writeFileSync } from 'node:fs';
import { Writer } from './types';

export class DataToFileWriter implements Writer {
  write(data: string, destination: string) {
    writeFileSync(destination, data, 'utf8');
  }
}
