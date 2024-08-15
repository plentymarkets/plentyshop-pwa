import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import { ConfigItem } from './types/ConfigItem';

const fetchLogo = async (data: { [key: string]: Array<ConfigItem> }) => {
  const logoUrl = data['store'].find((setting: ConfigItem) => setting.key === 'logo');

  if (!logoUrl?.value) {
    console.error('Logo URL not found.');
    return;
  }

  try {
    // eslint-disable-next-line no-console
    console.log('Fetching logo from:', logoUrl.value);

    const response = await axios({
      url: logoUrl.value,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    const imageBuffer = response.data;
    const fileType = logoUrl.value.split('.').pop();
    const logoPath = path.resolve(__dirname, `../public/logo.${fileType}`);

    fs.writeFileSync(logoPath, imageBuffer);
  } catch (error) {
    console.error('Error during the request:', error);
  }
};

export default fetchLogo;
