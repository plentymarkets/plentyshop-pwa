import { writeFileSync } from 'node:fs';
import { Writer } from '../types/Writer';

export class DataToFileWriter implements Writer {
  write(data: string, destination: string) {
    writeFileSync(destination, data, 'utf8');
  }
}
