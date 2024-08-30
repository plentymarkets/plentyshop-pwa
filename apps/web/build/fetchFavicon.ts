import path from 'node:path';
import fetchFile from './helpers/fetchFileHelper';
import { ConfigurationEntry } from './types/ConfigurationResponse';

const fetchFavicon = async (data: { [key: string]: Array<ConfigurationEntry> }) => {
  const faviconUrl = data['store'].find((setting: ConfigurationEntry) => setting.key === 'favIcon');

  if (!faviconUrl?.value) {
    console.error('FavIcon URL not found.');
    return;
  }

  if (!faviconUrl.value.endsWith('.ico')) {
    console.error('The URL does not point to a .ico file. Aborting the download.');
    return;
  }

  // eslint-disable-next-line no-console
  console.log('Fetching favicon from:', faviconUrl.value);

  const iconPath = path.resolve(__dirname, `../public/favicon.ico`);

  fetchFile(faviconUrl.value, iconPath);
};

export default fetchFavicon;
