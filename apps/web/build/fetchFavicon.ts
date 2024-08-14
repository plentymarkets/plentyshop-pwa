import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import { ConfigItem } from './types/ConfigItem';

const fetchFavicon = async (data: { [key: string]: Array<ConfigItem> }) => {
  const faviconUrl = data['store'].find((setting: ConfigItem) => setting.key === 'favIcon');

  if (!faviconUrl?.value) {
    console.error('FavIcon URL not found.');
    return;
  }

  if (!faviconUrl.value.endsWith('.ico')) {
    console.error('The URL does not point to a .ico file. Aborting the download.');
    return;
  }

  try {
    // eslint-disable-next-line no-console
    console.log('Fetching favicon from:', faviconUrl.value);

    const response = await axios({
      url: faviconUrl.value,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    const imageBuffer = response.data;
    const icoPath = path.resolve(__dirname, `../public/favicon.ico`);

    fs.writeFileSync(icoPath, imageBuffer);
  } catch (error) {
    console.error('Error during the request:', error);
  }
};

export default fetchFavicon;
