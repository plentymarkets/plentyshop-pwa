import axios from 'axios';
import https from 'https';
import fs from 'fs';
import os from 'os';
import path from 'path';

const envFilePath = path.resolve(__dirname, "../.env");
const envTmpFilePath = path.resolve(__dirname, '../.env.tmp');

// read .env file & convert to array
const readEnvVars = (path: string) => fs.readFileSync(path, "utf-8").split(os.EOL);

const getEnvValue = (path: string, key: string) => {
  // find the line that contains the key (exact match)
  const matchedLine = readEnvVars(path).find((line) => line.split("=")[0] === key);
  // split the line (delimiter is '=') and return the item at index 2
  return matchedLine !== undefined ? matchedLine.split("=")[1] : null;
};

const setEnvValue = (path: string, key: string, value: string) => {
  const envVars = readEnvVars(path);
  const targetLine = envVars.find((line) => line.split("=")[0] === key);
  if (targetLine !== undefined) {
    // update existing line
    const targetLineIndex = envVars.indexOf(targetLine);
    // replace the key/value with the new value
    envVars.splice(targetLineIndex, 1, `${key.toUpperCase()}="${value}"`);
  } else {
    // create new key value
    envVars.push(`${key.toUpperCase()}="${value}"`);
  }
  // write everything back to the file system
  fs.writeFileSync(path, envVars.join(os.EOL));
};

const getConfiguration = async () => {
  const requiredEnvVars = ['API_ENDPOINT', 'API_SECURITY_TOKEN', 'CONFIG_ID'];
  let requiredEnvData: string = '';

  console.log('Verifying required env variables...');

  for (let i = 0; i < requiredEnvVars.length; i++) {
    const envVar = requiredEnvVars[i];
    if (!getEnvValue(envFilePath, envVar)) {
      console.log(`Missing or invalid required environment variable: ${envVar}`);
      return;
    }

    const envValue = process.env[envVar];
    requiredEnvData += `${envVar}=${envValue}`;

    // For last iteration just skip adding
    if (i !== requiredEnvVars.length - 1) {
      requiredEnvData += '\n';
    }
  }

  console.log('Required env variables found ✅');

  // Create .env.tmp file
  console.log('Creating .env.tmp file...');
  fs.writeFile(envTmpFilePath, requiredEnvData, () => {});

  // Create axios instance
  const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.API_ENDPOINT,
    headers: {
      'X-Security-Token': process.env.API_SECURITY_TOKEN // Testing this what happen when bad token
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  });

  let response;

  try {
    console.log('Fetching PWA settings...');
    const { data } = await instance.get(`/storefront/settings/${process.env.CONFIG_ID}`);
    response = data;

    // console.log('Response', response, data);
    for (const category in response) {
      if (Array.isArray(data[category])) {
        response[category].forEach((item: any) => {
          setEnvValue(envTmpFilePath, item.key, item.value);
        })
      }
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('PWA settings error:', error.response!.data.error);
      return;
    }
  }

  // Copy the contents of .env.tmp to .env
  fs.copyFile(envTmpFilePath, envFilePath, () => {});
  console.log('.env.tmp data has been copied to .env');

  // Remove the .env.tmp file
  fs.unlink(envTmpFilePath, () => {});
  console.log('.env.tmp file has been removed');

  return Promise.resolve(response);
};

export default getConfiguration