import axios from 'axios';
import https from 'node:https';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const environmentFilePath = path.resolve(__dirname, '../.env');
const environmentTemporaryFilePath = path.resolve(__dirname, '../.env.tmp');

const readEnvironmentVariables = (path: string) => fs.readFileSync(path, 'utf8').split(os.EOL);

const getEnvironmentValue = (path: string, key: string) => {
  const matchedLine = readEnvironmentVariables(path).find((line) => line.split('=')[0] === key);
  return matchedLine === undefined ? null : matchedLine.split('=')[1];
};

const setEnvironmentValue = (path: string, key: string, value: string) => {
  const environmentVariables = readEnvironmentVariables(path);
  const targetLine = environmentVariables.find((line) => line.split('=')[0] === key);
  if (targetLine === undefined) {
    environmentVariables.push(`${key.toUpperCase()}="${value}"`);
  } else {
    const targetLineIndex = environmentVariables.indexOf(targetLine);
    environmentVariables.splice(targetLineIndex, 1, `${key.toUpperCase()}="${value}"`);
  }
  fs.writeFileSync(path, environmentVariables.join(os.EOL));
};

const getConfiguration = async () => {
  const fetchingStatus = getEnvironmentValue(environmentFilePath, 'DISABLE_SETTINGS_FETCH');
  if (fetchingStatus === '1') {
    console.warn(`Fetching PWA settings is disabled! Check DISABLE_SETTINGS_FETCH in .env file.`);
    return;
  }

  const requiredEnvironmentVariables = ['API_ENDPOINT', 'API_SECURITY_TOKEN', 'CONFIG_ID'];
  let requiredEnvironmentData = '';

  for (let index = 0; index < requiredEnvironmentVariables.length; index++) {
    const environmentVariable = requiredEnvironmentVariables[index];
    if (!getEnvironmentValue(environmentFilePath, environmentVariable)) {
      console.error(`Missing or invalid required environment variable: ${environmentVariable}`);
      return;
    }

    const environmentValue = process.env[environmentVariable];
    requiredEnvironmentData += `${environmentVariable}=${environmentValue}`;

    if (index !== requiredEnvironmentVariables.length - 1) {
      requiredEnvironmentData += '\n';
    }
  }

  fs.writeFile(environmentTemporaryFilePath, requiredEnvironmentData, () => {});

  const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.API_ENDPOINT,
    headers: {
      'X-Security-Token': process.env.API_SECURITY_TOKEN,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  let response;

  try {
    const { data } = await instance.get(`/storefront/settings/${process.env.CONFIG_ID}`);
    response = data;

    for (const category in response) {
      if (Array.isArray(data[category])) {
        response[category].forEach((item: { [key: string]: string }) => {
          setEnvironmentValue(environmentTemporaryFilePath, item.key, item.value);
        });
      }
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('PWA settings error:', error.response?.data.error);
      return;
    }
  }

  fs.copyFile(environmentTemporaryFilePath, environmentFilePath, () => {});
  fs.unlink(environmentTemporaryFilePath, () => {});

  console.log('New .env file generated!');

  return response;
};

export default getConfiguration;
