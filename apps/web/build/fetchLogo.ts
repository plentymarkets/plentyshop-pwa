import path from 'node:path';
import fetchFile from './helpers/fetchFileHelper';
import { ConfigurationEntry } from './types/ConfigurationResponse';

const fetchLogo = async (data: { [key: string]: Array<ConfigurationEntry> }) => {
  const logoUrl = data['store'].find((setting: ConfigurationEntry) => setting.key === 'logo');

  if (!logoUrl?.value) {
    console.error('Logo URL not found.');
    return;
  }

  // eslint-disable-next-line no-console
  console.log('Fetching logo from:', logoUrl.value);

  const fileType = logoUrl.value.split('.').pop();
  const logoPath = path.resolve(__dirname, `../public/logo.${fileType}`);

  fetchFile(logoUrl.value, logoPath);
};

export default fetchLogo;
