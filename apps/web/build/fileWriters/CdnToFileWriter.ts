import axios from 'axios';
import { writeFileSync } from 'node:fs';
import { Writer } from '../types/Writer';

export class CdnToFileWriter implements Writer {
  async write(url: string, destination: string) {
    try {
      const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'arraybuffer',
      });

      const imageBuffer = response.data;

      writeFileSync(destination, imageBuffer);
    } catch (error) {
      console.error('Error during the request:', error);
    }
  }
}
