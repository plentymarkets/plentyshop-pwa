import axios from 'axios';
import fs from 'node:fs';

const fetchFile = async (url: string, targetPath: string) => {
  try {
    const response = await axios({
      url: url,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    const imageBuffer = response.data;

    fs.writeFileSync(targetPath, imageBuffer);
  } catch (error) {
    console.error('Error during the request:', error);
  }
};

export default fetchFile;
