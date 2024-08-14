import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';

interface ConfigItem {
  configId: number;
  categoryId: number;
  key: string;
  value: string;
  labelKey: [];
  type: string;
  possibleValues: [];
  defaultValue: string | null;
}

interface ConfigResponse {
  control: ConfigItem[];
  currencies: ConfigItem[];
  store: ConfigItem[];
}

const fetchFavicon = async (data: ConfigResponse) => {
  const faviconUrl = data['store'].find((setting: ConfigItem) => setting.key === 'favIcon');

  if (!faviconUrl || !faviconUrl.value) {
    console.error('FavIcon URL not found.');
    return;
  }

  if (!faviconUrl.value.endsWith('.ico')) {
    console.error('The URL does not point to a .ico file. Aborting the download.');
    return;
  }

  try {
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
